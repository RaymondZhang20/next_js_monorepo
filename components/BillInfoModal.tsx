"use client";

import { AddIcon, CheckIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Box,
  Alert,
  AlertIcon,
  Button,
  Divider,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  HStack,
  IconButton,
  Stack,
  ToastId,
  useToast,
} from "@chakra-ui/react";
import { BillUtil, BillT, PaymentT } from "@utils/BillsUtils";
import React, { useEffect, useState } from "react";
import PaymentsForm from "./PaymentsForm";
import { v4 as uuidv4 } from "uuid";
import { BeatLoader, DotLoader } from "react-spinners";

type BillInfoModalProps = {
  bill: BillT;
  state: any;
  onClose: () => void;
  refreshPage: () => void;
};

const BillInfoModal: React.FC<BillInfoModalProps> = ({
  bill,
  state,
  onClose,
  refreshPage,
}) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [payer, setPayer] = useState<string>("");
  const [updatePayer, setUpdatePayer] = useState<string>("");
  const [newPayerName, setNewPayerName] = useState<string>("");
  const [payments, setPayments] = useState<PaymentT[]>(bill.payments);
  const [newState, setNewState] = useState<string>(state);
  const initialHint = () => {
    if (state === "update") {
      return "please indicate your identity";
    } else if (state === "doubt") {
      return "please review the bill info and comfirm";
    } else {
      return "";
    }
  };
  const [hint, setHint] = useState<string>(initialHint());

  useEffect(() => {
    if (newState === "update") {
      if (payer === "") {
        setHint("please indicate your identity");
      } else if (payer !== "new") {
        setHint("");
      } else if (newPayerName.trim() === "") {
        setHint("please indicate your name as a new payer");
      } else {
        setHint("");
      }
    }
  }, [payer, newPayerName]);

  useEffect(() => {
    setNewState(state);
    setHint(initialHint);
  }, [state]);

  const toast = useToast();
  const toastIdRef = React.useRef<ToastId | undefined>(undefined);

  function updateSubmittingToast(type: string) {
    let newToast = {};
    if (type === "success") {
      newToast = {
        title: "Update the Bill",
        description: "The bill has been updated",
        status: "success",
        icon: <CheckIcon />,
        position: "top",
        duration: 3000,
        isClosable: true,
      };
    } else {
      newToast = {
        title: "Update the Bill",
        description: "Fail to update the bill. \n Error: " + type,
        status: "error",
        icon: <WarningIcon />,
        position: "top",
        duration: 3000,
        isClosable: true,
      };
    }
    if (toastIdRef.current) {
      toast.update(toastIdRef.current, newToast);
    }
  }

  function addSubmittingToast() {
    toastIdRef.current = toast({
      title: "Update the Bill",
      description: "We are updating the bill your...",
      status: "loading",
      icon: <DotLoader size="30" color="#0303fc" />,
      position: "top",
      isClosable: true,
    });
  }

  const closeMedal = () => {
    setPayer("");
    setNewPayerName("");
    // setPayments(bill.payments);
    onClose();
  };

  const handlePaymentChange = (
    _id: string,
    field: keyof PaymentT,
    value: any
  ) => {
    const updatedPayments = [...payments];
    setPayments(
      updatedPayments.map((payment) => {
        if (payment._id === _id) {
          return { ...payment, [field]: value };
        } else {
          return payment;
        }
      })
    );
  };

  const handlePaymentOptionChange = (value: string) => {
    setPayer(value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPayerName(event.target.value);
  };

  const handleSubmitPayer = () => {
    if (payer === "new") {
      setNewState("update3");
      setUpdatePayer(newPayerName.trim());
    } else {
      setNewState("update2");
      setUpdatePayer(payer);
    }
  };

  const handleSubmitUpdatedPayment = async () => {
    setIsSubmitLoading(true);
    addSubmittingToast();
    const changedPayments: PaymentT[] = [];
    const newPayments: PaymentT[] = [];
    if (payer === "new") {
      payments.forEach((pay) => {
        if (pay.payer === updatePayer) newPayments.push(pay);
      });
    } else {
      payments.forEach((pay) => {
        if (pay.payer === updatePayer) {
          const samePayment: PaymentT | undefined = bill.payments.find(
            (p) => p._id === pay._id
          );
          if (samePayment === undefined) {
            newPayments.push(pay);
          } else {
            for (const key of Object.keys(samePayment) as Array<
              keyof PaymentT
            >) {
              if (samePayment[key] !== pay[key]) changedPayments.push(pay);
            }
          }
        }
      });
    }
    try {
      console.log({ changedPayments, newPayments });
      if (changedPayments.length === 0 && newPayments.length === 0) {
        throw new Error("There is no payments added or changed");
      }
      const response = await fetch(`/api/bills/${bill._id}`, {
        method: "PATCH",
        body: JSON.stringify({ changedPayments, newPayments }),
      });

      if (response.ok) {
        updateSubmittingToast("success");
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
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <Modal isOpen={newState !== "close"} onClose={closeMedal}>
      <ModalOverlay />
      <ModalContent>
        {(newState === "update" ||
          newState === "update2" ||
          newState === "update3") && <ModalHeader>Update Bill</ModalHeader>}
        {newState === "finalize" && <ModalHeader>Finalize Bill</ModalHeader>}
        {newState === "doubt" && <ModalHeader>Doubt Bill</ModalHeader>}
        {newState === "view" && <ModalHeader>View Bill</ModalHeader>}
        <ModalCloseButton />
        {hint !== "" && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {hint}
          </Alert>
        )}
        <ModalBody>
          {newState === "update" && (
            <Box>
              <RadioGroup
                defaultValue="modify"
                onChange={handlePaymentOptionChange}
              >
                {BillUtil.getDistinctPayers(bill).map((payer) => (
                  <Flex>
                    <Radio size="lg" ml={3} mb={2} value={payer}>
                      I am {payer}
                    </Radio>
                  </Flex>
                ))}
                <Divider my={2} />
                <Radio size="lg" ml={3} mb={2} value="new">
                  I am a new payer
                </Radio>
              </RadioGroup>
              <Input
                placeholder="Name"
                value={newPayerName}
                onChange={handleNameChange}
                disabled={payer !== "new"}
                errorBorderColor={
                  payer === "new" && newPayerName.trim() === ""
                    ? "crimson"
                    : undefined
                }
              />
            </Box>
          )}
          {(newState === "finalize" || newState === "doubt") &&
            bill.payments.map((payment) => (
              <PaymentsForm
                payment={payment}
                isReadOnly={true}
                handleChange={handlePaymentChange}
              />
            ))}
          {(newState === "update2" || newState === "update3") &&
            payments
              .filter((payment) => {
                return (
                  payment.payer ===
                  (newState === "update2" ? updatePayer : newPayerName)
                );
              })
              .map((payment, index) => (
                <PaymentsForm
                  payment={payment}
                  isReadOnly={false}
                  handleChange={handlePaymentChange}
                />
              ))}
          {(newState === "update2" || newState === "update3") && (
            <HStack alignItems="center">
              <IconButton
                icon={<AddIcon />}
                aria-label="Add one more Payment"
                onClick={() => {
                  setPayments([
                    ...payments,
                    {
                      _id: uuidv4(),
                      payer:
                        newState === "update2" ? updatePayer : newPayerName,
                      amount: "0",
                      activity: "",
                    },
                  ]);
                }}
                mb={4}
                colorScheme="blue"
              />
            </HStack>
          )}
        </ModalBody>
        <ModalFooter>
          {newState === "update" && (
            <Button
              colorScheme="blue"
              onClick={handleSubmitPayer}
              isDisabled={
                (payer === "new" && newPayerName.trim() === "") || payer === ""
              }
            >
              Submit
            </Button>
          )}
          {(newState === "update2" || newState === "update3") && (
            <Button
              colorScheme="blue"
              onClick={handleSubmitUpdatedPayment}
              isDisabled={
                (payer === "new" && newPayerName.trim() === "") || payer === ""
              }
              isLoading={isSubmitLoading}
              spinner={<BeatLoader size={8} color="white" />}
            >
              Submit
            </Button>
          )}
          <Button variant="ghost" ml={3} onClick={closeMedal}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BillInfoModal;
