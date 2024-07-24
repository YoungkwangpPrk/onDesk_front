import React, { useRef, useEffect } from 'react';
import { Editor, Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { v4 } from 'uuid';

import { inactiveStoreResult } from '../InactiveStore';

import '../assets/styles/Editor.css';
import api from '../utils/api';

function ToastEditorResult(props) {
  // const imgUuid = v4();
  const editorRef = useRef();

  useEffect(() => {
    inactiveStoreResult.editor = null;
    if(props.html) {
      editorRef.current?.getInstance().setHTML(props.html);
      inactiveStoreResult.editorEmpty = props.html.length;
      inactiveStoreResult.editor = props.html;
    }
  }, [props.html]);

  const getHtml = () => {
    if(editorRef.current) {
      const HTMLContent = editorRef.current?.getInstance().getHTML();
      console.log(HTMLContent);
      inactiveStoreResult.editorEmpty = editorRef.current?.getInstance().getMarkdown().length;
      inactiveStoreResult.editor = HTMLContent;
    };
  };

  //이미지 서버에 전송
  const imageUpload = async (file, callback) => {
    const limit = 8388608;
    const fileType = file.type;
    if(file.size > limit){
      alert('8MB미만의 파일만 업로드 가능합니다.');
      return; 
    }
      const imgUuid = v4();
      const formdata = new FormData();
      console.log(file.size);
      console.log(fileType)
      formdata.append('file', file);
      formdata.append('path', 'itsm_image');
      formdata.append('uuid', imgUuid);
      const result = await api.uploadFile(formdata, fileType);
    if(result) {
      setTimeout(() => {callback(`${process.env.REACT_APP_IMG_URL}/${result.data.detail}`)}, 100);
    };
  };

  //base64로 업로드
  const imageHandler = (file, callback) => {
    const fr = new FileReader();
    fr.onload = (file) => {
      console.log(file);
      const img = new Image();
      console.log(file.target.result);
      img.onload = (e) => {
        let newCanvas = document.createElement('canvas');
        var ctx = newCanvas.getContext('2d');

        console.log(e.target.width, e.target.height);

        newCanvas.width = e.target.width;
        newCanvas.height = e.target.height;

        ctx.drawImage(img, 0, 0);
        
        const dataUrl = newCanvas.toDataURL('image/jpeg', 0.3);
        console.log(dataUrl);
        callback(dataUrl);
      }
      img.src = file.target.result;

    }
    fr.readAsDataURL(file);
  };

  return (
    <div style={{display: props.loading === true ? 'none' : 'contents'}}>
    {(props.html && props.readMode === true) ? 
      <div className='viewer-border'>
        <div className='viewer-width'>
          <Viewer initialValue={props.html} />
        </div>
      </div>
      :
      <div style={{zIndex: 1}}>
      <Editor 
        placeholder='내용을 입력해 주세요...'
        initialValue={props.html ? props.html : ''}
        initialEditType='wysiwyg'
        previewStyle='vertical'
        height='300px'
        ref={editorRef}
        hideModeSwitch={true}
        hooks={{addImageBlobHook: imageUpload}}
        onChange={getHtml}
        autofocus={false}
      />
      </div>
      }
    </div>
  );
};

export default ToastEditorResult;