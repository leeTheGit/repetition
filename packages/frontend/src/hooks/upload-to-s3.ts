// import { useEffect, useState } from "react";

type AssetData = {
    entity_uuid?: string
    entity?: string
    attribute?: string
    type: string
    assetType: string
}

var MAX_WIDTH = 300
var MAX_HEIGHT = 300

function resize(img: HTMLImageElement, width: number, height: number) {
    // Change the resizing logic
    if (width > height) {
        if (width > MAX_WIDTH) {
            height = height * (MAX_WIDTH / width)
            width = MAX_WIDTH
        }
    } else {
        if (height > MAX_HEIGHT) {
            width = width * (MAX_HEIGHT / height)
            height = MAX_HEIGHT
        }
    }

    var canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d')?.drawImage(img, 0, 0, width, height)
    // const resizedImage = canvas.toDataURL('image/jpeg');
    // return canvas.toBlob();
}

function useUploadToS3() {
    const uploadAsset = async (
        file: File,
        data: AssetData
    ) => {


        if (file) {
            const { type, name } = file

            // Get the image dimsensions
            let width = 0
            let height = 0
            const reader = new FileReader()
            reader.onload = (e) => {
                const img = new Image()
                img.onload = () => {
                    width = img.width
                    height = img.height
                    // resize(img, width, height)
                }
                if (e.target?.result) {
                    img.src = e.target.result as string
                }
            }
            reader.readAsDataURL(file)

            const fetchUrl = `/api/assets/signedurl?name=${name}&type=${type}`
            let response = null
            try {
                const signedUrl = await fetch(fetchUrl)
                response = await signedUrl.json()
            } catch (error) {
                console.log('[ERROR][assets/getsignedurl]', error)
                throw new Error('Invalid response from server')
            }
            const url = response.data

            const xhr = new XMLHttpRequest()
            const success = await new Promise((resolve) => {
                // xhr.upload.addEventListener("progress", (event) => {
                //     if (event.lengthComputable) {
                //        if (percentageRef.current) {
                //             percentageRef.current.innerHTML = (event.loaded / event.total).toString();
                //         }
                //     }
                // });
                // xhr.addEventListener("progress", (event) => {
                //     if (event.lengthComputable) {
                //         downloadProgress.value = event.loaded / event.total;
                //     }
                // });
                xhr.addEventListener('loadend', () => {
                    resolve(xhr.readyState === 4 && xhr.status === 200)
                })
                xhr.open('PUT', url.uploadUrl, true)
                xhr.setRequestHeader('Content-Type', type)
                xhr.send(file)
            })

            if (true === success) {
                const saveData = {
                    entity_uuid: data.entity_uuid || null,
                    entity: data.entity || null,
                    entityAttribute: data.attribute || null,
                    type: data.type,
                    url: url.Key,
                    contentType: type,
                    name: name,
                    assetType: data.assetType,
                    filesize: file.size,
                    filename: name,
                    filetype: type,
                    width,
                    height,
                }
                
                const saved = await fetch(`/api/assets`, {
                    method: 'POST',
                    body: JSON.stringify(saveData),
                })

                if (!saved.ok) {
                    console.log('[ERROR][assets/save]', saved)
                    throw new Error('Invalid response from server')
                }
                const savedData = await saved.json()
                return savedData.data
            }
            return false
        }
    }

    return { uploadAsset }
}

export default useUploadToS3
