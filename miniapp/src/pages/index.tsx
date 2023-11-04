import {
  SimpleGrid,
  IconButton,
  Tabs,
  TabList,
  Tab,
  Card,
  CardHeader,
  Image,
  ButtonGroup,
  Button,
  TabPanel,
  TabPanels,
  TableContainer,
  Table,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Box,
  CardBody,
  Heading,
  Stack,
  ListItem as Litem,
  StackDivider,
  UnorderedList,
  Input, InputGroup, InputRightElement

} from '@chakra-ui/react';

import { Search2Icon } from "@chakra-ui/icons";

import { useEffect, useMemo, useState } from 'react';
import { ListItem } from '@/components/ListItem';
import { Empty } from '@/components/Empty';
import { useTitle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';
import { AssetsTokenItem } from '@/components/AssetsTokenItem';
import { useAccountStore } from '@/store';
import paytoview from '@/lib/paytoview';

export default function Index() {
  useTitle('PayToView');
  const { t } = useTranslation();
  const nav = useNavigate();
  const { accountInfo, balance } = useAccountStore((state) => state);
  const toAdd = () => {
    nav(ROUTE_PATH.DETAIL_ADD);
  };
  const toPublished = () => {
    nav(ROUTE_PATH.PUBLISHED);
  };
  const toPaid = () => {
    nav(ROUTE_PATH.PAID);
  };
  const toForwarded = () => {
    nav(ROUTE_PATH.FORWARDED);
  };
  const toEarn = () => {
    nav(ROUTE_PATH.EARN);
  };
  const toRead = () => {
    nav(ROUTE_PATH.DETAIL_READ);
  };
  const clear = () => {
    localStorage.clear();
    location.reload();
  };

  const [searchTerm, setSearchTerm] = useState('');

  const handleKeyPress = (event) => {
    // 在按下 Enter 键时，执行搜索
    if (event.key === 'Enter') {
      nav(ROUTE_PATH.DETAIL_READ + '/?contract=' + searchTerm);
    }
  }

  useEffect(() => { }, []);
  return (
    <div className='h-full overflow-hidden flex flex-col'>
      <div className='overflow-y-auto flex-1'>
        <div className='p-4'>
          <div className='bg-gray-100 p-4 mb-4 rounded-2xl'>
            <div className='flex mb-6 items-center'>
              <Image
                src='/logo.png'
                className='w-6 h-6 bg-gray-200 rounded-full mr-6'></Image>
              <div className='break-all'>{accountInfo.publicKey}</div>
            </div>
            <div className='flex justify-between items-end '>
              <div className='flex items-end'>
                <span className='mr-2 text-4xl font-bold leading-none'>
                  1000
                </span>
                <span className='text-sm leading-none mb-1'>TVS</span>
              </div>
              <p className='text-xs text-gray-500 leading-none mb-1'>
                Tinyverse
              </p>
            </div>
          </div>
          <div className=' bg-gray-100 p-4 mb-4 rounded-2xl'>
            <SimpleGrid columns={2} columnGap='20px'>
              <div
                className='text-center bg-gray-200 p-2 rounded-xl'>
                <div className='mb-2 text-xs'>主账号地址</div>
                <div className='flex items-end justify-center'>
                  <span className='mr-2 text-xm font-bold leading-none'>
                    0801e*****a1b4
                  </span>
                  {/* <span className='text-xs leading-none '>TVS</span> */}
                </div>
              </div>
              <div
                className='text-center bg-gray-200 p-2 rounded-xl'
                onClick={toEarn}>
                <div className='mb-2 text-xs'>24小时内收入</div>
                <div className='flex items-end justify-center'>
                  <span className='mr-2 text-xm font-bold leading-none'>
                    50
                  </span>
                  <span className='text-xs leading-none'>TVS</span>
                </div>
              </div>
            </SimpleGrid>
          </div>
          <div className='mt-4 mb-4 m-2'>
            <SimpleGrid columns={5} columnGap='25px'>
              <div
                className='text-center'
                onClick={toAdd}>
                <img
                  className={`h-12 w-12`}
                  src={`/images/publish.png`}>
                </img>
                <span className='text-xs text-blue-500'>Publish</span>
              </div>
              <div
                className='text-center'
                onClick={toEarn}>
                <img
                  className={`h-12 w-12`}
                  src={`/images/earning.png`}>
                </img>
                <span className='text-xs text-blue-500'>Earning</span>
              </div>
              <div
                className='text-center'
                onClick={toPublished}>
                <img
                  className={`h-12 w-12`}
                  src={`/images/published.png`}>
                </img>
                <span className='text-xs text-blue-500'>Pub.</span>
              </div>
              <div
                className='text-center'
                onClick={toPaid}>
                <img
                  className={`h-12 w-12`}
                  src={`/images/paid.png`}>
                </img>
                <span className='text-xs text-blue-500'>Paid</span>
              </div>
              <div
                className='text-center'
                onClick={toForwarded}>
                <img
                  className={`h-12 w-12`}
                  src={`/images/forwarded.png`}>
                </img>
                <span className='text-xs text-blue-500'>Fwd.</span>
              </div>
            </SimpleGrid>
          </div>
          <div className='mt-m-2'>
            <InputGroup>
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              // 根据需要添加其他属性
              />
              <InputRightElement>
                <Search2Icon color="gray.400" />
              </InputRightElement>
            </InputGroup>
          </div>
          <div className='mt-4 mb-4' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className='text-xm ml-2'>交易记录</span>
            <span className='text-xm mr-2'>more</span>
          </div>
          <div style={{ height: '400px', overflowY: 'auto' }} className='text-xs'>
            <UnorderedList>
              <Litem className='m-2'>
                <Card>
                  <CardHeader>
                    <Heading size='sm'>/tx/d79b...3abe</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stack divider={<StackDivider />} spacing='2'>
                      <Box>
                        <Heading size='xm' textTransform='uppercase'>
                          收入:
                        </Heading>
                        <div className='text-xm'>
                          10 TVS
                        </div>
                      </Box>
                      <Box>
                        <Heading size='xm' textTransform='uppercase'>
                          支出:
                        </Heading>
                        <div className='text-xm'>
                          0 TVS
                        </div>
                      </Box>
                      <Box>
                        <Heading size='xm' textTransform='uppercase'>
                          交易方:
                        </Heading>
                        <div className='text-xm font-black'>
                          080112202eb5947819be566f30c0faa3df0d272a47c0ae441d42e217bbcfd05932845adc
                        </div>
                      </Box>
                    </Stack>
                  </CardBody>
                </Card>
              </Litem>
              <Litem className='mt-6 m-2'>
                <Card>
                  <CardHeader>
                    <Heading size='sm'>/tx/d701..fd05</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stack divider={<StackDivider />} spacing='2'>
                      <Box>
                        <Heading size='xm' textTransform='uppercase'>
                          收入:
                        </Heading>
                        <div className='text-base'>
                          0 TVS
                        </div>
                      </Box>
                      <Box>
                        <Heading size='xm' textTransform='uppercase'>
                          支出:
                        </Heading>
                        <div className='text-xm'>
                          -105 TVS
                        </div>
                      </Box>
                      <Box>
                        <Heading size='xm' textTransform='uppercase'>
                          交易方:
                        </Heading>
                        <div className='text-xm font-black'>
                          080112202b61d8d5bd70fa7ad30b29848008d429b362baee191be6471ca0ad4cf601e14b
                        </div>
                      </Box>
                    </Stack>
                  </CardBody>
                </Card>
              </Litem>
              <Litem className='mt-6 m-2'>
                <Card>
                  <CardHeader>
                    <Heading size='sm'>/tx/d79b...abef</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stack divider={<StackDivider />} spacing='2'>
                      <Box>
                        <Heading size='xm' textTransform='uppercase'>
                          收入:
                        </Heading>
                        <div className='text-xm'>
                          0 TVS
                        </div>
                      </Box>
                      <Box>
                        <Heading size='xm' textTransform='uppercase'>
                          支出:
                        </Heading>
                        <div className='text-xm'>
                          -3 TVS
                        </div>
                      </Box>
                      <Box>
                        <Heading size='xm' textTransform='uppercase'>
                          交易方:
                        </Heading>
                        <div className='text-xm font-black'>
                          08011220d74e79a35f09f3febee86918ab579f94e75b4a21a2cad47ebf403a6a089bc0b9
                        </div>
                      </Box>
                    </Stack>
                  </CardBody>
                </Card>
              </Litem>
              <Litem className='mt-6 m-2'>
                <Card>
                  <CardHeader>
                    <Heading size='sm'>/tx/d79b...abef</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stack divider={<StackDivider />} spacing='2'>
                      <Box>
                        <Heading size='xm' textTransform='uppercase'>
                          收入:
                        </Heading>
                        <div className='text-xm'>
                          0 TVS
                        </div>
                      </Box>
                      <Box>
                        <Heading size='xm' textTransform='uppercase'>
                          支出:
                        </Heading>
                        <div className='text-base'>
                          -58 TVS
                        </div>
                      </Box>
                      <Box>
                        <Heading size='xm' textTransform='uppercase'>
                          交易方:
                        </Heading>
                        <div className='text-xm font-black'>
                          08011220d74e79a35f09f3febee86918ab579f94e75b4a21a2cad47ebf403a6a089bc0b9
                        </div>
                      </Box>
                    </Stack>
                  </CardBody>
                </Card>
              </Litem>
              <Litem className='mt-6 m-2'>
                <Card>
                  <CardHeader>
                    <Heading size='sm'>/tx/d79b...abef</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stack divider={<StackDivider />} spacing='2'>
                      <Box>
                        <Heading size='xm' textTransform='uppercase'>
                          收入:
                        </Heading>
                        <div className='text-xm'>
                          60 TVS
                        </div>
                      </Box>
                      <Box>
                        <Heading size='xm' textTransform='uppercase'>
                          支出:
                        </Heading>
                        <div className='text-xm'>
                          0 TVS
                        </div>
                      </Box>
                      <Box>
                        <Heading size='xm' textTransform='uppercase'>
                          交易方:
                        </Heading>
                        <div className='text-xm font-black'>
                          08011220d74e79a35f09f3febee86918ab579f94e75b4a21a2cad47ebf403a6a089bc0b9
                        </div>
                      </Box>
                    </Stack>
                  </CardBody>
                </Card>
              </Litem>
              <Litem className='mt-6 m-2'>
                <Card>
                  <CardHeader>
                    <Heading size='sm'>/tx/d79b...abef</Heading>
                  </CardHeader>
                  <CardBody>
                    <Stack divider={<StackDivider />} spacing='2'>
                      <Box>
                        <Heading size='xm' textTransform='uppercase'>
                          收入:
                        </Heading>
                        <div className='text-xm'>
                          80 TVS
                        </div>
                      </Box>
                      <Box>
                        <Heading size='xm' textTransform='uppercase'>
                          支出:
                        </Heading>
                        <div className='text-xm'>
                          0 TVS
                        </div>
                      </Box>
                      <Box>
                        <Heading size='xm' textTransform='uppercase'>
                          交易方:
                        </Heading>
                        <div className='text-xm font-black'>
                          08011220d74e79a35f09f3febee86918ab579f94e75b4a21a2cad47ebf403a6a089bc0b9
                        </div>
                      </Box>
                    </Stack>
                  </CardBody>
                </Card>
              </Litem>
            </UnorderedList>
          </div>
        </div>
      </div>
      {/* <div className='h-16 flex justify-center items-center'>
        <ButtonGroup size='sm' variant='outline' isAttached>
          <IconButton
            isRound={true}
            variant='solid'
            colorScheme='teal'
            aria-label='Done'
            onClick={toAdd}
            icon={<Icon icon='material-symbols:add' className='text-2xl' />}
          />
          <Button onClick={toPublished}>Published</Button>
          <Button onClick={toPaid}>Paid</Button>
          <Button onClick={toForwarded}>Forwarded</Button>
        </ButtonGroup>
      </div> */}
    </div>
  );
}
