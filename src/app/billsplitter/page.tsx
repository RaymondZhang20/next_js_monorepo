"use client";

import {
  Box,
  Center,
  Flex,
  Grid,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { BillT } from "@utils/BillsUtils";
import BillCard from "@components/BillCard";

const page = () => {
  const [isClient, setIsClient] = useState(false);
  const [bills, setBills] = useState<BillT[]>([]);

  useEffect(() => {
    setIsClient(true);
    const fetchBills = async () => {
      try {
        const response = await fetch('/api/bills', {method: 'GET'});
        if (response.ok) {
          const data = await response.json();
          setBills(data);
        } else {
          throw new Error('Failed to fetch bills');
        }
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };
    fetchBills();
  }, []);

  const handleAddCard = () => {};
  return (
    <section className="relative w-full h-1/5 flex-center flex-col ">
      <div className="absolute top-0 w-full h-24 md:h-26 bg-gradient-to-l hover:bg-gradient-to-r from-purple-300 via-indigo-500 to-violet-300"></div>
      <div className="absolute top-24 md:top-26 w-2/5 h-8 md:h-14 md:min-w-80 min-w-64 bg-gradient-to-l from-amber-200 to-orange-200 rounded-b-full"></div>
      <div className="relative -mt-2">
        <h1 className="text-center head_text text-gray-700 -mb-12">
          Share and Split
        </h1>
        <br className="" />
        <div className="flex-center -mb-12">
          <span className="inline text-center head_text sm:text-4xl md:text-5xl">
            &#128176;
          </span>
          <span className="inline text-5xl text-center head_text orange_gradient">
            Bills
          </span>
          <span className="inline text-center head_text sm:text-4xl md:text-5xl">
            &#128176;
          </span>
        </div>
        <br />
        <h1 className="text-center head_text blue_gradient -mt-12">
          With Friends
        </h1>
      </div>
      <div className="m-4"></div>
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={4}
      >
        <Box
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          onClick={handleAddCard}
          cursor="pointer"
          justifyContent="center"
          alignItems="center"
        >
          <Center>
          <IconButton
            aria-label="Add Bill"
            icon={<AddIcon />}
            boxSize={20}
            fontSize={20}
            colorScheme="teal"
            mb={2}
          />
          </Center>
          <Center>
          <Text fontSize='3xl' fontWeight="bold">Add New Bill</Text>
          </Center>
        </Box>

        {bills && bills.map((bill: BillT) => (
          <Flex direction="column">
            <BillCard bill={bill} />
          </Flex>
        ))}
      </Grid>
    </section>
  );
};

export default page;
