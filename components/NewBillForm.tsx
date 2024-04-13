'use client'

import React, { useState } from 'react'
import { Box, Button, Flex, FormControl, FormLabel, HStack, Input, Textarea, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, Tag, TagCloseButton, TagLabel, Text } from "@chakra-ui/react";

type NewBillFormProps = {
  data: any,
  setFormData: (data: any) => void;
};

const NewBillForm: React.FC<NewBillFormProps> = ({ data, setFormData }) => {
  const [participantName, setParticipantName] = useState<string>("");

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleAddParticipant = () => {
    if (participantName.trim() !== '') {
      if (!data.participants.includes(participantName)) {
        setFormData((prevData: any) => ({
          ...prevData,
          participants: [...prevData.participants, participantName],
        }));
      }
      setParticipantName('');
    }
  };

  const handleRemoveParticipant = (indexToRemove: number) => {
    setFormData((prevData: any) => ({
      ...prevData,
      participants: prevData.participants.filter((_: any, index: number) => index !== indexToRemove),
    }));
  };

  return (
    <Box maxW="md" mx="auto" mt={1} p={4} borderWidth="1px" borderRadius="lg">
      <FormControl id="billTitle" mb={4}>
        <FormLabel>Bill Title</FormLabel>
        <Input
          placeholder="Enter bill title"
          value={data.billTitle}
          onChange={(e) => handleInputChange('billTitle', e.target.value)}
        />
      </FormControl>
      <FormControl id="initializer" mb={4}>
        <FormLabel>Initializer</FormLabel>
        <Input
          placeholder="Enter your name as the initializer of the bill"
          value={data.initializer}
          onChange={(e) => handleInputChange('initializer', e.target.value)}
        />
      </FormControl>
      <FormControl id="comment" mb={4}>
        <FormLabel>Comment(Optional)</FormLabel>
        <Textarea
          placeholder="Enter comment"
          value={data.comment}
          onChange={(e) => handleInputChange('comment', e.target.value)}
        />
      </FormControl>
      <FormControl id="number" mb={4}>
        <FormLabel>Number Of Participants(not including you)</FormLabel>
        <NumberInput
          step={1}
          defaultValue={1}
          min={1}
          max={50}
          value={data.numberOfParticipants}
          onChange={(value) => handleInputChange('numberOfParticipants', value)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <FormControl id="participants" mb={4}>
        <FormLabel>Participants (Optional, not including you)</FormLabel>
        <Text mt={-2} mb={2} fontSize="sm" color="blue.400">
          Participants can add themselves later on
        </Text>
        <Flex align="center">
          <Input
            placeholder="Enter participant's name"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddParticipant();
              }
            }}
          />
          <Button ml={1} onClick={handleAddParticipant}>
            Add
          </Button>
        </Flex>
        <HStack spacing={4} mt={2}>
          <Flex flexWrap="wrap">
            {data.participants.map((participant: string, index: number) => (
              <Tag
                key={index}
                size={'lg'}
                borderRadius="full"
                variant="subtle"
                colorScheme="cyan"
                m={1}
              >
                <TagLabel>{participant}</TagLabel>
                <TagCloseButton onClick={() => handleRemoveParticipant(index)} />
              </Tag>
            ))}
          </Flex>
        </HStack>
      </FormControl>
    </Box>
  )
}

export default NewBillForm