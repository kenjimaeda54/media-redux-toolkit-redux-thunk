import { memo } from "react"
import { Image, Button, Box, Icon, Text, Spinner } from "@chakra-ui/react"
import { BsFillTrash2Fill } from "react-icons/bs"
import { useFetchPhotoQuery, useRemovePhotoMutation } from "../../store"
import { AlbumModel } from "../../types/albumModel"
import { PhotoModel } from "../../types/photoModel"

export interface IAccordPhotoProps {
  album: AlbumModel
}

const AccordPhoto = memo(({ album }: IAccordPhotoProps) => {
  const { isLoading, data, error } = useFetchPhotoQuery(album)
  const [removePhoto, resultsPhoto] = useRemovePhotoMutation()

  const handleDeletePhoto = (photo: PhotoModel) => removePhoto(photo)

  if (error) {
    return <Text> Something wrong try load photo </Text>
  }

  return (
    <Box display="flex" flexDir="row" gap="4">
      {data ?
        data.map((it: PhotoModel) => (
          <>
            <Button isLoading={resultsPhoto.isLoading} onClick={() => handleDeletePhoto(it)}  >
              {resultsPhoto.isLoading ?
                <Spinner />
                :
                <Icon as={BsFillTrash2Fill} size={20} />

              }             </Button>
            <Image key={it.id} alt="random pic" borderRadius="4px" boxSize="100px" objectFit="contain" src={it.url} />
          </>
        )

        )
        :
        <Text>Something wrong tyr load photo</Text>
      }
    </Box>
  )

})

export default AccordPhoto
