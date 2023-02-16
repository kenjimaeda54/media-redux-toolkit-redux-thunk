import { useEffect } from "react"
import { Skeleton, Button, Text, Stack, Accordion, HStack, Spinner } from '@chakra-ui/react'
import { useSelector } from "react-redux"
import { fetchUser, RootState, postUser } from "../../store"
import { useThunk } from "../../hooks/use-thunk"
import { SingleAccordItem } from "../../components/accordItem/SingleAccordItem"

export default function Home() {
  const [doFetchUser, isLoadingUser, errorUser] = useThunk(fetchUser)
  const [doPostUser, isLoadingCreateUser, errorUserCreate] = useThunk(postUser)
  const { data, } = useSelector((state: RootState) => state.users)



  useEffect(() => {
    doFetchUser()
  }, [])

  if (errorUser) {
    return <Text fontSize='md'>Something wrong fetch data </Text>
  }

  if (errorUserCreate) {
    return <Text>Something wrong create users</Text>
  }

  const handleAddUser = () => doPostUser()



  return (
    <Stack h="100vh" w="100vw" p="7"  >
      <HStack justify="space-between" >
        <Text>Users</Text>
        <Button alignSelf="flex-end" disabled={isLoadingCreateUser} onClick={handleAddUser} >
          {isLoadingCreateUser ?
            <Spinner />
            :
            <Text> Add Users </Text>
          }

        </Button>
      </HStack>
      <Accordion allowToggle  >
        <Skeleton isLoaded={!isLoadingUser}>
          <Stack spacing="3" >

            {data.map(it =>
              <SingleAccordItem key={it.id} data={it} />
            )}
          </Stack>
        </Skeleton>
      </Accordion>
    </Stack>

  )
}
