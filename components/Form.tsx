'use client'

import React from 'react'
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";

const Form = () => {
  return (
    <Box maxW="md" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="lg">
      <FormControl id="billName" mb={4}>
        <FormLabel>Bill Name</FormLabel>
        <Input placeholder="Enter bill name" />
      </FormControl>
      <FormControl id="amount" mb={4}>
        <FormLabel>Amount</FormLabel>
        <Input type="number" placeholder="Enter bill amount" />
      </FormControl>
      <FormControl id="payer" mb={4}>
        <FormLabel>Payer</FormLabel>
        <Input placeholder="Enter payer's name" />
      </FormControl>
      <FormControl id="participants" mb={4}>
        <FormLabel>Participants</FormLabel>
        <Input placeholder="Enter participants' names separated by commas" />
      </FormControl>
      <Button colorScheme="teal" type="submit">
        Add Bill
      </Button>
    </Box>
  )
}

export default Form