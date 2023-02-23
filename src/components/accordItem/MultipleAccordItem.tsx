import { Icon, AccordionItem, Text, Box, AccordionButton, AccordionPanel, AccordionIcon, HStack, Button, Spinner, Skeleton, Image } from "@chakra-ui/react"
import { memo } from "react"
import { UsersModel } from "../../types/usersModel"
import { BsTrash2Fill } from "react-icons/bs"
import { useThunk } from "../../hooks/use-thunk"
import { deleteUser, useFetchAlbumQuery, useAddAlbumMutation, useRemoveAlbumMutation, useAddPhotoMutation, useFetchPhotoQuery } from "../../store"
import { AlbumModel } from "../../types/albumModel"
import AccordPhoto from "../accordPhoto/AccordPhoto"

export const SingleAccordItem = memo(({ data }: { data: UsersModel }) => {
  const [doDeleteUser, isLoading, error] = useThunk(deleteUser)
  const { isLoading: isLoadingAlbumQuery, data: dataAlbumQuery, error: errorAlbumQuery } = useFetchAlbumQuery(data)
  const [addAlbum, resultsAdd] = useAddAlbumMutation()
  const [removeAlbum, resultsRemove] = useRemoveAlbumMutation()
  const [addImg, resutlsImg] = useAddPhotoMutation()

  const handleDeleteUser = () => doDeleteUser(data)

  if (error) {
    return <Text> Something wrong try delete user </Text>
  }


  const handleAddAlbum = () => addAlbum(data)

  const handleDeleteAlbum = (album: AlbumModel) => removeAlbum(album)

  const handleAddImg = (album: AlbumModel) => addImg(album)


  return (
    <AccordionItem border="1px" borderColor="bisque" borderRadius="md" >
      <h2>
        <AccordionButton  >
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
      <Skeleton isLoaded={!isLoadingAlbumQuery}>
        <AccordionPanel display="flex" flexDir="column" pb={4}>
          {errorAlbumQuery &&
            <Text> Something wrong tyr show album </Text>
          }


          <Button my="4" disabled={resultsAdd.isLoading} display="flex" alignSelf="flex-end" onClick={handleAddAlbum}>
            {resultsAdd.isLoading ?
              <Spinner />
              :
              <Text as="span"> Add album</Text>
            }
          </Button>
          <Box flexDir="column" gap={3} display="flex">
            {dataAlbumQuery && dataAlbumQuery.length === 0 ? "Não possui album" :
              dataAlbumQuery?.map((it: AlbumModel) =>
                <AccordionItem key={it.id}>
                  <h2>
                    <AccordionButton  >
                      <HStack width="100%" justify="space-between" >
                        <HStack>
                          <Button onClick={() => handleDeleteAlbum(it)} >
                            {resultsRemove.isLoading ? <Spinner /> : <Icon as={BsTrash2Fill} size={20} />}
                          </Button>
                          <Text>{it.title
                          } </Text>
                        </HStack>
                        <AccordionIcon />
                      </HStack>
                    </AccordionButton>
                  </h2>
                  <AccordionPanel display="flex" flexDir="column" >
                    <Button disabled={resutlsImg.isLoading} onClick={() => handleAddImg(it)} alignSelf="flex-end">
                      {resutlsImg.isLoading ?
                        <Spinner />
                        :
                        <Text> Add img </Text>
                      }
                    </Button>
                    <AccordPhoto album={it} />
                  </AccordionPanel>
                </AccordionItem>
              )}
          </Box>
        </AccordionPanel>
      </Skeleton>
    </AccordionItem>
  )
})
