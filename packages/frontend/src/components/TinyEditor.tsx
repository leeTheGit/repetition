import { useTheme } from 'next-themes'

import { Editor } from '@tinymce/tinymce-react'
import { useThemeDetector } from '@/hooks/use-theme-detector'
// import {
//     useLazyGetSignedUrlQuery,
// } from '@/store/index'

interface Props {
    reference: any
    content: string
    // changeHandler: (data:string) => void;
}

export default function TinyEditor({ content, reference }: Props) {
    // var [ trigger ] = useLazyGetSignedUrlQuery();
    const { theme } = useTheme()
    const isDarkTheme = useThemeDetector()

    // const example_image_upload_handler = async (blobInfo:any, progress:any): Promise<string> => {
    //    let file = blobInfo.blob();
    //     const { type, name } = file;
    //     // const signedUrl:Promise<data:{uploadUrl:string, Key:string} = await trigger({name, type});
    //     const signedUrl:any = await trigger({name, type});
    //     const url  = signedUrl.data;

    //     return new Promise((resolve, reject) => {
    //         const xhr = new XMLHttpRequest();
    //         xhr.upload.onprogress = (e) => {
    //             progress(e.loaded / e.total * 100);
    //         };

    //         xhr.onload = () => {
    //             if (xhr.status === 403) {
    //                 reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
    //                 return;
    //             }

    //             if (xhr.status < 200 || xhr.status >= 300) {
    //                 reject('HTTP Error: ' + xhr.status);
    //                 return;
    //             }

    //             resolve(url.Key);
    //         };

    //         xhr.onerror = () => {
    //             reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
    //         };

    //         xhr.open('PUT', url.uploadUrl);
    //         xhr.setRequestHeader("Content-Type", type);
    //         xhr.send(file);
    //     });
    // };

    // https://medium.com/hypersphere-codes/detecting-system-theme-in-javascript-css-react-f6b961916d48

    let skin = theme === 'dark' ? 'tinymce-5-dark' : 'oxide'
    if (theme === 'system') {
        skin = isDarkTheme ? 'tinymce-5-dark' : 'oxide'
    }

    let contentCSS = theme === 'dark' ? 'tinymce-5-dark' : 'tinymce-5'
    if (theme === 'system') {
        contentCSS = isDarkTheme ? 'tinymce-5-dark' : 'tinymce-5'
    }

    return (
        <>
            {/* https://skin.tiny.cloud/t5/ */}
            {/* https://www.tiny.cloud/docs/tinymce/latest/customize-ui/ */}
            {/* https://www.tiny.cloud/docs/tinymce/latest/basic-setup/ */}
            {/* https://www.tiny.cloud/docs/tinymce/latest/react-ref/ */}
            <Editor
                // tinymceScriptSrc={window.origin + '/tinymce/tinymce.min.js'}
                tinymceScriptSrc={
                    'https://elcyen-prod-storeuploads-tezkaofv.s3.ap-southeast-2.amazonaws.com/platform/tinymce/tinymce.js'
                }
                onInit={(evt, editor) => {
                    reference.current = editor
                }}
                initialValue={content}
                // onDirty={() => setDirty(true)}
                // onAddUndo={(evt, editor) => {
                // }}
                // onChange={(dialogapi, details) => {
                //     changeHandler(editorRef.current.getContent());
                // }}
                init={{
                    //@ts-expect-error
                    license_key: 'gpl',
                    skin: skin,
                    content_css: contentCSS,
                    height: "100%",
                    scriptLoading: 'defer',
                    width: '100%',
                    menubar: false,
                    plugins: ['code', 'save', 'image'],
                    file_picker_types: 'file image media',
                    automatic_uploads: true,
                    toolbar:
                        'undo redo | link image | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help | save | code',
                    // images_upload_handler: example_image_upload_handler,
                    // file_picker_callback: (cb, value, meta) => {
                    //     const input = document.createElement('input');
                    //     input.setAttribute('type', 'file');
                    //     input.setAttribute('accept', 'image/*');

                    //     input.addEventListener('change', (e) => {
                    //         //@ts-ignore
                    //         const file = e.target.files[0];

                    //         const reader = new FileReader();
                    //         reader.addEventListener('load', () => {
                    //             /*
                    //             Note: Now we need to register the blob in TinyMCEs image blob
                    //             registry. In the next release this part hopefully won't be
                    //             necessary, as we are looking to handle it internally.
                    //             */
                    //             if (reader !== null && reader.result !== null) {
                    //                 if (typeof reader.result === 'string') {
                    //                     const id = 'blobid' + (new Date()).getTime();
                    //                     const blobCache =  reference.current.editorUpload.blobCache;
                    //                     const base64 = reader.result.split(',')[1];
                    //                     const blobInfo = blobCache.create(id, file, base64);
                    //                     blobCache.add(blobInfo);
                    //                     /* call the callback and populate the Title field with the file name */
                    //                     cb(blobInfo.blobUri(), { title: file.name });
                    //                 }
                    //             }
                    //         });
                    //         reader.readAsDataURL(file);

                    //     });

                    //     input.click();
                    // },

                    content_style:
                        'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
            />
            {/* <button onClick={() => changeHandler(editorRef.current.getContent())}>Log editor content</button> */}
        </>
    )
}
