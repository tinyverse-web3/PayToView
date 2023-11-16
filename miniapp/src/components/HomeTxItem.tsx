import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Stack,
  StackDivider,
  Box,
} from '@chakra-ui/react';
export const HomeTxItem = () => {
  return (
    <div className='mt-6 m-2'>
      <Card variant={'filled'}>
        <CardHeader>
          <Heading size='sm'>ID：/tx/d79b...abef</Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing='2'>
            <Box>
              <Heading size='xm' textTransform='uppercase'>
                收入:
              </Heading>
              <div className='text-xm'>60 TVS</div>
            </Box>
            <Box>
              <Heading size='xm' textTransform='uppercase'>
                支出:
              </Heading>
              <div className='text-xm'>0 TVS</div>
            </Box>
            <Box>
              <Heading size='xm' textTransform='uppercase'>
                交易方:
              </Heading>
              <div className='text-xm'>
                08011220d74e79a35f09f3febee86918ab579f94e75b4a21a2cad47ebf403a6a089bc0b9
              </div>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </div>
  );
};
