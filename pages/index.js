/** @jsx jsx */
import { useState } from 'react';
import React, { Fragment } from 'react';
import { Container, jsx, Card, Heading, Text, Grid, Box, Flex, Button } from 'theme-ui';
import useMaker from '../hooks/useMaker';
import { useEffect } from 'react';
import IntroMDX from '../text/intro.mdx';
import mockPolls from '../_mock/topics'

const Index = () => {
  const { maker, web3Connected, vote, getPollCreatedEvents } = useMaker();

  const [polls, setPolls] = useState(null);
  const [proxyAddress, setProxyAddress] = useState(null);

  useEffect(() => {
    const fetchPolls = async () => {
        const eventPolls = await getPollCreatedEvents();
        console.log("polls here", eventPolls);
        const mappedPolls = eventPolls.map( (poll, i) => (
           <Card key={i}>
               <Box sx={{float:"right"}}>
                   <Button onClick={()=> vote(poll.returnValues.pollId, 2)} sx={{mr:1}}>Yes</Button>
                   <Button sx={{mr:4}}>No</Button>
               </Box>
               <h2>Poll ID: {poll.returnValues.pollId}</h2>
               Creator: {poll.returnValues.creator}
               <br/>
               Start date: {poll.returnValues.startDate}
               <br/>
               End date: {poll.returnValues.endDate}
               <br/>
               End date: {poll.returnValues.endDate}
               <br/>
               Checkout the github: <a target="_blank" href={poll.returnValues.url} >{poll.returnValues.url}</a>
           </Card>
        ))
        setPolls(mappedPolls);
     };
    const checkProxy = async () => {
      const proxy = await maker.currentProxy();
      setProxyAddress(proxy);
    };
    if (web3Connected) {
      fetchPolls();
      checkProxy();
    }
  }, [web3Connected, maker, getPollCreatedEvents]);




  return (
    <Container>
      <Box sx={{ mt: 2, ml: [0, 'auto'], mr: [null, 0] }}>
        <Heading>Polls</Heading>
        <Card sx={{ py: 0, px: 3, my: 2 }}>
          { polls ? polls : 'Please connect Wallet to Kovan Network' }
        </Card>
      </Box>
    </Container>
  );
};

export default Index;
