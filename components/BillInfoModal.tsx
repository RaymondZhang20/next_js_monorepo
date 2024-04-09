import { AddIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import { BillUtil, BillT, PaymentT } from "@utils/BillsUtils";
import React, { useEffect, useState } from "react";
import PaymentsForm from "./PaymentsForm";
import { v4 as uuidv4 } from "uuid";

type BillInfoModalProps = {
  bill: BillT;
  state: any;
  onClose: () => void;
};

const BillInfoModal: React.FC<BillInfoModalProps> = ({
  bill,
  state,
  onClose,
}) => {
  const [payer, setPayer] = useState<string>("");
  const [updatePayer, setUpdatePayer] = useState<string>("");
  const [newPayerName, setNewPayerName] = useState<string>("");
  const [payments, setPayments] = useState<PaymentT[]>([...bill.payments]);
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

  const closeMedal = () => {
    setPayer("");
    setNewPayerName("");
    setPayments(bill.payments);
    onClose();
  };

  const handlePaymentChange = (_id: string, field: keyof PaymentT, value: any) => {
    const updatedPayments = [...payments];
    setPayments(updatedPayments.map((payment) => {
        if (payment._id === _id) {
            return {...payment, [field]: value};
        } else {
            return payment;
        }
    }));
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

  const handleSubmitUpdatedPayment = () => {
    const changedPayments: PaymentT[] = [];
    if (payer === "new") {
      payments.forEach((pay) => {
        if (pay.payer === updatePayer && Number(pay.amount) > 0) changedPayments.push(pay);
      })
    } else {
      payments.forEach((pay) => {
        if (pay.payer === updatePayer && Number(pay.amount) > 0) {
          const samePayment: PaymentT|undefined = bill.payments.find(p => p._id === pay._id);
          if (samePayment === undefined) {
            changedPayments.push(pay);
          } else {
            for (const key of Object.keys(samePayment) as Array<keyof PaymentT>) {
              if (samePayment[key] !== pay[key]) changedPayments.push(pay);
            }
          }
        };
      })
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
                <PaymentsForm payment={payment} isReadOnly={true} handleChange={handlePaymentChange} />
            ))}
          {(newState === "update2" || newState === "update3") &&
            payments
              .filter((payment) => {
                return payment.payer === ((newState === "update2")?updatePayer:newPayerName);
              })
              .map((payment, index) => (
                <PaymentsForm payment={payment} isReadOnly={false} handleChange={handlePaymentChange} />
              ))}
          {(newState === "update2" || newState === "update3") && (
              <HStack alignItems="center">
              <IconButton
                icon={<AddIcon />}
                aria-label="Add one more Payment"
                onClick={() => {
                  setPayments([...payments, {_id: uuidv4(), payer: (newState === "update2")?updatePayer:newPayerName, amount: '0', activity:''}]);
                }}
                mb={4}
                colorScheme="blue"
              />
              </HStack>
          )}
        </ModalBody>
        <ModalFooter>
          {newState === "update" && <Button
            colorScheme="blue"
            onClick={handleSubmitPayer}
            isDisabled={
              (payer === "new" && newPayerName.trim() === "") || payer === ""
            }
          >
            Submit
          </Button>}
          {(newState === "update2" || newState === "update3") && <Button
            colorScheme="blue"
            onClick={handleSubmitUpdatedPayment}
            isDisabled={
              (payer === "new" && newPayerName.trim() === "") || payer === ""
            }
          >
            Submit
          </Button>}
          <Button variant="ghost" ml={3} onClick={closeMedal}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BillInfoModal;
