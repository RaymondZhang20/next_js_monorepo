"use client";

import { AddIcon, ArrowRightIcon, CheckIcon, TriangleDownIcon, TriangleUpIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Text,
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
  Table,
  Tbody,
  Td,
  Th,
  Tr,
} from "@chakra-ui/react";
import { BillUtil, BillT, PaymentT, BillState } from "@utils/BillsUtils";
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
    } else if (state === "finalize" || state === "doubt") {
      return "please review the bill and comfirm";
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
    } else if (type === "finalize") {
      newToast = {
        title: "Finalize the Bill",
        description: "The bill has been finalized",
        status: "success",
        icon: <CheckIcon />,
        position: "top",
        duration: 3000,
        isClosable: true,
      };
    } else if (type === "doubt") {
      newToast = {
        title: "Doubt the Bill",
        description: "The bill has been doubted, you can update it now",
        status: "success",
        icon: <CheckIcon />,
        position: "top",
        duration: 3000,
        isClosable: true,
      };
    } else if (type === "archive") {
      newToast = {
        title: "Archive the Bill",
        description: "The bill has been archived",
        status: "success",
        icon: <CheckIcon />,
        position: "top",
        duration: 3000,
        isClosable: true,
      };
    } else if (type === "reload") {
      newToast = {
        title: "Reload the Bill",
        description: "The bill has been resent to pending state",
        status: "success",
        icon: <CheckIcon />,
        position: "top",
        duration: 3000,
        isClosable: true,
      };
    } else if (type === "delete") {
      newToast = {
        title: "Delete the Bill",
        description: "The bill has been deleted",
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

  const handleUpdateBillState = async () => {
    setIsSubmitLoading(true);
    addSubmittingToast();
    try {
      let data = {state: BillState.Pending};
      if (newState === "finalize") {
        data.state = BillState.Done;
      } else if (newState === "doubt") {
        data.state = BillState.Doubtful;
      } else if (newState === "archive") {
        data.state = BillState.Archived;
      } else if (newState === "reload") {
        data.state = BillState.Pending;
      }
      const response = await fetch(`/api/bills/${bill._id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        updateSubmittingToast(newState);
        refreshPage();
        closeMedal();
      } else {
        const errorMessage = await response.text();
        updateSubmittingToast(errorMessage);
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        updateSubmittingToast("An error ocurred when try to connect to server: " + errorMessage);
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
        {newState === "archive" && <ModalHeader>Archive Bill</ModalHeader>}
        {newState === "reload" && <ModalHeader>Reload Bill</ModalHeader>}
        {newState === "view" && <ModalHeader>View Transactions</ModalHeader>}
        <ModalCloseButton />
        {hint !== "" && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {hint}
          </Alert>
        )}
        <ModalBody maxHeight="450px" overflowY="auto">
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
          {newState === "view" && 
          <Table variant="simple">
          <Tbody>
            <Tr>
              <Th fontSize="xl" fontWeight="bold">From</Th>
              <Th fontSize="xl" fontWeight="bold">To</Th>
              <Th fontSize="xl" fontWeight="bold">Amount</Th>
            </Tr>
            {bill.outComes.map((transaction, index) => (
              <Tr key={index}>
                <Td>{transaction.from}</Td>
                {/* <Td>
                  <ArrowRightIcon mx={2} />
                </Td> */}
                <Td>
                  <Text>{transaction.to}</Text>
                </Td>
                <Td>${transaction.amount}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        }
        {newState === "archive" &&
          <Text>Do you want to Archive this bill?</Text>
        }
        {newState === "reload" &&
          <Text>Do you want to Reload this bill?</Text>
        }
        {newState === "delete" &&
          <HStack>
            <Text>Please enter the admin credential to delete the bill</Text>
            <Input></Input>
          </HStack>
        }
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
          {(newState === "finalize" || newState === "doubt" || newState === "archive" || newState === "reload") && (
            <Button
              colorScheme="blue"
              onClick={handleUpdateBillState}
              isLoading={isSubmitLoading}
              spinner={<BeatLoader size={8} color="white" />}
            >
              Comfirm
            </Button>
          )}
          {(newState === "delete") && (
            <Button
              colorScheme="red"
              // onClick={handleUpdateBillState}
              isLoading={isSubmitLoading}
              spinner={<BeatLoader size={8} color="white" />}
            >
              Delete
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
