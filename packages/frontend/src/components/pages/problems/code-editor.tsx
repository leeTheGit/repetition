import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import Editor from '@monaco-editor/react'
import { UseFormReturn } from 'react-hook-form'


interface Props {
    // codeStash: {user:string, test:string}
    form: UseFormReturn<any, any, undefined>
}

export const CodeEditor = React.forwardRef<{
    CodeEditorRef:HTMLInputElement, 
    TestCodeEditorRef:HTMLInputElement
    codeStach:{user:string, test:string}
    
} | null, Props>((props, ref) => {
    const form = props.form
    
    // @ts-expect-error
    const { CodeEditorRef, TestCodeEditorRef, codeStash } = ref;

    const submitCode = async () => {
        const code = CodeEditorRef.current.getValue()
        const req = await fetch('/api/code', {
            method: 'POST',
            body: code
        })
        const result = await req.json();
    }


    return (
        <Tabs className="w-full" defaultValue="user_code" onValueChange={(value) => {
            // When flipping between tabs we lose any code that has been changed
            // without being saved so we stash when switching then restsore.
            // Each editor has an onMount function used to place the text back.
            if (value === 'user_code') {
                codeStash.current.test = TestCodeEditorRef.current.getValue()
                TestCodeEditorRef.current = null
            }
            if (value === 'test_code') {
                codeStash.current.user = CodeEditorRef.current.getValue()
                CodeEditorRef.current = null
            }

        }}>
            <TabsList>

                <TabsTrigger
                    className={`data-[state=active]:bg-buttonactive data-[state=active]:text-white`}
                    value={`user_code`}
                >
                    User code
                </TabsTrigger>
                <TabsTrigger
                    className={`data-[state=active]:bg-buttonactive data-[state=active]:text-white`}
                    value={`test_code`}
                >
                    Test code
                </TabsTrigger>

            </TabsList>

            <TabsContent value={`user_code`}>
                <div>
                    <Editor
                        value={
                            // codeStash.user ||
                            form.formState
                                .defaultValues
                                ?.starterCode
                        }
                        onMount={(editor, monaco) => {
                            CodeEditorRef.current = editor
                            if (codeStash.current.user !== "") {
                                CodeEditorRef.current.setValue(codeStash.current.user)
                            }
                        }}
                        theme="vs-dark"
                        height="60vh"
                        defaultLanguage="javascript"
                        defaultValue=""
                    />
                    <Button className="mt-4" type="button" onClick={submitCode}>Test code</Button>
                </div>
            </TabsContent>
            
            <TabsContent value={`test_code`}>
                <div className="">
                    <Editor
                        value={
                            form.formState
                                .defaultValues
                                ?.testCode || ''
                        }
                        onMount={(editor, monaco) => {
                            TestCodeEditorRef.current = editor
                            if (codeStash.current.test !== "") {
                                TestCodeEditorRef.current.setValue(codeStash.current.test)
                            }
                        }}
                        // onChange={(editor, monaco) => {
                        //     // console.log(editor)
                        //     // console.log(monaco)
                        // }}
                        theme="vs-dark"
                        height="60vh"
                        defaultLanguage="javascript"
                        defaultValue="// some comment"
                    />
                </div>

            </TabsContent>


        </Tabs>

    )
})