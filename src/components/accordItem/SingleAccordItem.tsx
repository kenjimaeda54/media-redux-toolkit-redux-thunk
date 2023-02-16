import { Icon, Box, AccordionItem, Text, AccordionButton, AccordionPanel, AccordionIcon, HStack, Button, Spinner } from "@chakra-ui/react"
import { memo } from "react"
import { UsersModel } from "../../types/usersModel"
import { BsTrash2Fill } from "react-icons/bs"
import { useThunk } from "../../hooks/use-thunk"
import { deleteUser } from "../../store"

export const SingleAccordItem = memo(({ data }: { data: UsersModel }) => {
  const [doDeleteUser, isLoading, error] = useThunk(deleteUser)


  const handleDeleteUser = () => doDeleteUser(data)

  if (error) {
    return <Text> Something wrong try delete user </Text>
  }


  return (
    <AccordionItem border="1px" borderColor="bisque" borderRadius="md" >
      <h2>
        <AccordionButton>
          <HStack width="100%" justify="space-between" >
            <HStack>
              <Button onClick={handleDeleteUser} >
                {isLoading ? <Spinner /> : <Icon as={BsTrash2Fill} size={20} />}
              </Button>
              <Text> {data.name} </Text>
            </HStack>
            <AccordionIcon />
          </HStack>
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        afodnfosnofnsofnsofnso
      </AccordionPanel>
    </AccordionItem>
  )
})
