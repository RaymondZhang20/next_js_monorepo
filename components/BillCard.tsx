'use client'

import {
  EditIcon,
  CheckIcon,
  DeleteIcon,
  ViewIcon,
  QuestionIcon,
  ViewOffIcon,
  RepeatClockIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import {
  Tag,
  Text,
  Card,
  CardBody,
  AvatarGroup,
  Avatar,
  Stack,
  Heading,
  Tooltip,
  Divider,
  CardFooter,
  ButtonGroup,
  Button,
  Badge,
  Flex,
  Box,
  IconButton,
} from "@chakra-ui/react";
import {
  BillState,
  BillT,
  BillUtil,
  PaymentT,
  PaymentUtil,
  BillOutcomeT,
} from "@utils/BillsUtils";
import React, { useState } from "react";
import BillInfoModal from "./BillInfoModal";

type BillCardProps = {
  bill: BillT;
  refreshPage: () => void;
};

const BillCard: React.FC<BillCardProps> = ({ bill, refreshPage }) => {
  const [infoModalSate, setInfoModelState] = useState("close");
  const [showReminders, setShowReminders] = useState(false);

  const toggleReminders = () => {
    setShowReminders(!showReminders);
  };

  const generateBreakDown = (payments: PaymentT[], showTitle: boolean) => {
    if (showTitle) {
      return (
        <span>
          Break Down:
          {BillUtil.getBreakDown(bill).map((breakdown: BillOutcomeT, index) => (
            <React.Fragment key={index}>
              <br />
              {breakdown.payer}: $ {breakdown.amount}
            </React.Fragment>
          ))}
        </span>
      );
    } else {
      return (
        <span>
          {BillUtil.getBreakDown(bill).map((breakdown: BillOutcomeT, index) => (
            <React.Fragment key={index}>
              <br />
              {breakdown.payer}: $ {breakdown.amount}
            </React.Fragment>
          ))}
        </span>
      );
    }
  };

  const setBackGroundColor = (state: BillState) => {
    switch (state) {
      case "Pending":
        return "#faf5a7";
      case "Doubtful":
        return "#fccb87";
      case "Done":
        return "#bdfaa7";
      case "Error":
        return "#f5abab";
      case "Archived":
        return "#e5ebe4";
    }
  };

  const setBadgeTheme = (state: BillState) => {
    switch (state) {
      case "Pending":
        return "orange";
      case "Doubtful":
        return "red";
      case "Done":
        return "teal";
      case "Error":
        return "blackAlpha";
      case "Archived":
        return "gray";
    }
  };

  const handleCloseInfoModal = () => {
    setInfoModelState;
  };

  const payerLeft = Math.max(0, bill.requiredPeople - BillUtil.getDistinctPayers(bill).length);

  const generateButtonGroup = (state: BillState) => {
    switch (state) {
      case "Pending":
        return (
          <Flex wrap="wrap" align="center">
            <ButtonGroup spacing="2" mt={2} ml={2}>
              <Button
                variant="solid"
                colorScheme="orange"
                rightIcon={<EditIcon />}
                onClick={() => {
                  setInfoModelState("update");
                }}
              >
                Update
              </Button>
              <Button
                variant="solid"
                colorScheme="green"
                rightIcon={<CheckIcon />}
                isDisabled={payerLeft>0}
                onClick={() => {
                  setInfoModelState("finalize");
                }}
              >
                Finalize
              </Button>
            </ButtonGroup>
            <Button
              variant="ghost"
              colorScheme="blue"
              mt={2}
              ml={2}
              rightIcon={<ViewOffIcon />}
              onClick={() => {
                setInfoModelState("archive");
              }}
            >
              Archive
            </Button>
          </Flex>
        );
      case "Done":
        return (
          <Flex wrap="wrap" align="center">
            <ButtonGroup spacing="2" mt={2} ml={2}>
              <Button
                variant="solid"
                colorScheme="blue"
                rightIcon={<ViewIcon />}
                onClick={() => {
                  setInfoModelState("view");
                }}
              >
                View
              </Button>
              <Button
                variant="solid"
                colorScheme="red"
                rightIcon={<QuestionIcon />}
                onClick={() => {
                  setInfoModelState("doubt");
                }}
              >
                Doubt
              </Button>
            </ButtonGroup>
            <Button
              variant="ghost"
              colorScheme="blue"
              mt={2}
              ml={2}
              rightIcon={<ViewOffIcon />}
              onClick={() => {
                setInfoModelState("archive");
              }}
            >
              Archive
            </Button>
          </Flex>
        );
      case "Archived":
        return (
          <Flex wrap="wrap" align="center">
            <ButtonGroup spacing="2" mt={2} ml={2}>
              <Button
                variant="solid"
                colorScheme="blue"
                rightIcon={<RepeatClockIcon />}
                onClick={() => {
                  setInfoModelState("reload");
                }}
              >
                Reload
              </Button>
              <Button
                variant="ghost"
                colorScheme="red"
                rightIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </ButtonGroup>
          </Flex>
        );
      case "Doubtful":
        return (
          <Flex wrap="wrap" align="center">
            <ButtonGroup spacing="2" mt={2} ml={2}>
              <Button
                variant="solid"
                colorScheme="orange"
                rightIcon={<EditIcon />}
                onClick={() => {
                  setInfoModelState("update");
                }}
              >
                Update
              </Button>
              <Button
                variant="solid"
                colorScheme="green"
                rightIcon={<CheckIcon />}
                onClick={() => {
                  setInfoModelState("finalize");
                }}
              >
                Finalize
              </Button>
            </ButtonGroup>
            <Button
              variant="ghost"
              colorScheme="blue"
              mt={2}
              ml={2}
              rightIcon={<ViewOffIcon />}
              onClick={() => {
                setInfoModelState("archive");
              }}
            >
              Archive
            </Button>
          </Flex>
        );
      case "Error":
        return (
          <Flex wrap="wrap" align="center">
            <ButtonGroup spacing="2" mt={2} ml={2}>
              <Button
                variant="solid"
                colorScheme="red"
                rightIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </ButtonGroup>
          </Flex>
        );
    }
  };

  return (
    <>
      <Card backgroundColor="#F6F6F6" key="bill._id" maxW="md">
        <CardBody>
          <Box
            m={-5}
            backgroundColor={setBackGroundColor(bill.state)}
            h={12}
            borderTopRadius="unset"
          ></Box>
          <Stack mb={2} spacing={4} direction="row" align="center">
            <Heading size="xl">{bill.title}</Heading>
            <Badge
              ml="1"
              fontSize="1.1em"
              colorScheme={setBadgeTheme(bill.state)}
            >
              {bill.state.toString()}
            </Badge>
          </Stack>
          <AvatarGroup size="md" max={5}>
            {BillUtil.getDistinctPayers(bill).map((payer: string, index) => (
              <Avatar key={index} name={payer} />
            ))}
          </AvatarGroup>
          <Stack mt="3" mb="5" spacing="3">
            <Flex>
              <Tooltip label={`Requires ${bill.requiredPeople} payer`}>
                <Badge
                  variant="outline"
                  fontSize="1em"
                  colorScheme={
                    payerLeft >
                    0
                      ? "red"
                      : "green"
                  }
                >
                  {payerLeft}{" "}
                  payers left
                </Badge>
              </Tooltip>
            </Flex>
              <Flex align="center">
              <IconButton ml={-2}
                isRound={true}
                colorScheme='blue'
                size='sm'
                icon={showReminders ? <TriangleDownIcon /> : <TriangleUpIcon />}
                aria-label={showReminders ? "Hide" : "Show more"}
                onClick={toggleReminders}
              />
              <Text ml={2}>{showReminders ? "Hide" : "Show more"}</Text>
              </Flex>
              {showReminders && (
                <>
                  <Text whiteSpace="pre-line" fontSize='sm'>{bill.reminders}</Text>
                  <Flex>
                    <Tag colorScheme='gray' variant='solid'>Initialized By: {bill.initializer}</Tag>
                  </Flex>
                  <Text as='kbd'>{generateBreakDown(bill.payments, false)}</Text>
                </>
              )}
            <Tooltip label={generateBreakDown(bill.payments, true)}>
              <Text color="blue.600" fontSize="2xl">
                $ {bill.sum} CAD
              </Text>
            </Tooltip>
            <Text mt={2} fontSize="sm" color="gray.500">
              Created Date: {new Date(bill.createdDate).toLocaleDateString()}
            </Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>{generateButtonGroup(bill.state)}</CardFooter>
      </Card>
      <BillInfoModal
        refreshPage={refreshPage}
        bill={bill}
        state={infoModalSate}
        onClose={() => {
          setInfoModelState("close");
        }}
      />
    </>
  );
};

export default BillCard;
