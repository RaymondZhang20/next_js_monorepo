'use client'

import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Alert, AlertIcon, useToast, ToastId } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import NewBillForm from './NewBillForm';
import { BeatLoader, DotLoader } from 'react-spinners';
import { CheckIcon, WarningIcon } from '@chakra-ui/icons';

type NewBillModalProps = {
    state: boolean;
    onClose: () => void;
    refreshPage: () => void;
  };

  interface NewBillFormData {
    billTitle: string;
    initializer: string;
    comment: string;
    numberOfParticipants: number;
    participants: string[];
  }
  

const NewBillModal: React.FC<NewBillModalProps> = ({state, onClose, refreshPage}) => {
  const [hint, setHint] = useState<string>("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<NewBillFormData>({
    billTitle: '',
    initializer: '',
    comment: '',
    numberOfParticipants: 1,
    participants: [],
  });

  useEffect(() => {
    if (formData.billTitle.trim() === '') {
      setHint('Bill title should not be empty');
      setIsSubmitDisabled(true);
    } else if (formData.initializer.trim() === '') {
      setHint('Initializer should not be empty');
      setIsSubmitDisabled(true);
    } else if (formData.participants.length > formData.numberOfParticipants) {
      setHint('Participants cannot exceed the specified number');
      setIsSubmitDisabled(true);
    } else {
      setHint('');
      setIsSubmitDisabled(false);
    }
  }, [formData]);

  const toast = useToast();
  const toastIdRef = React.useRef<ToastId | undefined>(undefined);

  function updateSubmittingToast(type:string) {
    let newToast = {};
    if (type === "success") {
        newToast = {
            title: 'Create new Bill',
            description: "The bill has been created",
            status: 'success',
            icon: <CheckIcon/>,
            position: 'top',
            duration: 3000,
            isClosable: true,
          }
    } else {
        newToast = {
            title: 'Create new Bill',
            description: "Fail to create the bill. \n Error: " + type,
            status: 'error',
            icon: <WarningIcon/>,
            position: 'top',
            duration: 3000,
            isClosable: true,
          }
    }
    if (toastIdRef.current) {
      toast.update(toastIdRef.current, newToast)
    }
  }

  function addSubmittingToast() {
    toastIdRef.current = toast({
        title: 'Create new Bill',
        description: "We are creating the bill your...",
        status: 'loading',
        icon: <DotLoader size="30" color="#0303fc" />,
        position: 'top',
        isClosable: true,
      });
  }

  const handleSubmitNewBill = async () => {
    setIsSubmitLoading(true);
    addSubmittingToast();
    try {
      const response = await fetch("/api/bills/new", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        updateSubmittingToast('success');
        refreshPage();
        closeMedal();
      } else {
        const errorMessage = await response.text();
        updateSubmittingToast(errorMessage);
      }
    } catch (error) {
        if (error instanceof Error) {
            const errorMessage = error.message;
            updateSubmittingToast(errorMessage);
          } else {
            console.error('An unexpected error occurred:', error);
          }
    } finally {
        setIsSubmitLoading(false);
    }
  };

  const closeMedal = () => {
    onClose();
    setFormData({
        billTitle: '',
        initializer: '',
        comment: '',
        numberOfParticipants: 1,
        participants: [],
      });
  };

  return (
    <Modal isOpen={state} onClose={closeMedal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Bill</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        {hint !== "" && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {hint}
          </Alert>
        )}
            <NewBillForm data={formData} setFormData={setFormData}/>
        </ModalBody>
        <ModalFooter>
            <Button
            colorScheme="blue"
            onClick={handleSubmitNewBill}
            isDisabled={isSubmitDisabled}
            isLoading={isSubmitLoading}
            spinner={<BeatLoader size={8} color='white' />}
          >
            Submit
          </Button>
          <Button variant="ghost" ml={3} onClick={closeMedal}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default NewBillModal