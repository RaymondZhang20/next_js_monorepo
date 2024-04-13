'use client'

import {
  Input,
  Box,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { PaymentUtil, PaymentT } from "@utils/BillsUtils";
import React from "react";

type PaymentsFormProps = {
  payment: PaymentT;
  isReadOnly: boolean;
  handleChange: (_id: string, field: keyof PaymentUtil, value: any) => void;
};

const PaymentsForm: React.FC<PaymentsFormProps> = ({
  payment,
  isReadOnly,
  handleChange,
}) => {
  return (
    <Box
      key={payment._id}
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      mb={4}
      width="80%"
      maxWidth="400px"
    >
      <FormControl>
        <FormLabel>Payer</FormLabel>
        <Input value={payment.payer} isReadOnly={true} />
      </FormControl>
      <FormControl>
        <FormLabel>Amount</FormLabel>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            color="gray.300"
            fontSize="1.2em"
            ml={-3}
          >
            $
          </InputLeftElement>
          <NumberInput ml={5} defaultValue={0} precision={2} step={1} min={0} value={payment.amount}
            isReadOnly={isReadOnly}
            onChange={(e) =>
              handleChange(
                payment._id,
                "amount",
                e.replace(/,/g, '')
              )
            }>
  <NumberInputField />
  <NumberInputStepper>
    <NumberIncrementStepper />
    <NumberDecrementStepper />
  </NumberInputStepper>
</NumberInput>
          {/* <InputRightElement>
            <CheckIcon color="green.500" />
          </InputRightElement> */}
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Activity</FormLabel>
        <Input
          value={payment.activity}
          isReadOnly={isReadOnly}
          onChange={(e) =>
            handleChange(payment._id, "activity", e.target.value)
          }
        />
      </FormControl>
    </Box>
  );
};

export default PaymentsForm;
