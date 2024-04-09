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
} from "@utils/BillsUtils";
import React, { useState } from "react";
import BillInfoModal from "./BillInfoModal";

type BillCardProps = {
  bill: BillT;
};

const BillCard: React.FC<BillCardProps> = ({ bill }) => {
  const [infoModalSate, setInfoModelState] = useState("close");
  const [showReminders, setShowReminders] = useState(false);

  const toggleReminders = () => {
    setShowReminders(!showReminders);
  };

  const generateBreakDown = (payments: PaymentT[]) => {
    return (
      <span>
        Break Down:
        {payments.map((payment, index) => (
          <React.Fragment key={index}>
            <br />
            {payment.payer}: $ {payment.amount}
          </React.Fragment>
        ))}
      </span>
    );
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
            {bill.payments.map((payment: PaymentT) => (
              <Avatar key={payment._id} name={payment.payer} />
            ))}
          </AvatarGroup>
          <Stack mt="3" mb="5" spacing="3">
            <Flex>
              <Tooltip label={`Requires ${bill.requiredPeople} payer`}>
                <Badge
                  variant="outline"
                  fontSize="1em"
                  colorScheme={
                    bill.requiredPeople -
                      BillUtil.getDistinctPayers(bill).length >
                    0
                      ? "red"
                      : "green"
                  }
                >
                  {bill.requiredPeople -
                    BillUtil.getDistinctPayers(bill).length}{" "}
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
                aria-label={showReminders ? "Hide comments" : "Show comments"}
                onClick={toggleReminders}
              />
              <Text ml={2}>{showReminders ? "Hide comments" : "Show comments"}</Text>
              </Flex>
              {showReminders && (
                <Text>{bill.reminders}</Text>
              )}
            <Tooltip label={generateBreakDown(bill.payments)}>
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
