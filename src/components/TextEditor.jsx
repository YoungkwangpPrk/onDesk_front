import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, ContentState, AtomicBlockUtils, Modifier } from 'draft-js';
import 'draft-js/dist/Draft.css';
import draftToHtml from 'draftjs-to-html';
//import htmlToDraft from 'html-to-draftjs';

import { FileUploader, Icon } from '@ui5/webcomponents-react';
import '@ui5/webcomponents-icons/dist/AllIcons';

import { inactiveStore } from '../InactiveStore';

import '../assets/styles/Common.css';

function TextEditor( props ) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  // const [blockButton, setBlockButton] = useState('');

  useEffect(() => {

    // const currentSelection = editorState.getSelection();
    // const currentKey = currentSelection.getStartKey();
    // const currentBlock = editorState.getCurrentContent().getBlockForKey(currentKey);
    const currentCon = editorState.getCurrentContent();

    
    inactiveStore.editorEmpty = editorState.getCurrentContent().hasText()
    let converted = convertToRaw(currentCon)
    console.log(converted)
    
    //   let htmltext = '';
    //   let atomicIdx = 0;
    // const {blocks, entityMap} = converted;
    // blocks.map((item) => {
    //   if(item.type === 'atomic'){
    //     if(item.entityRanges.length === 0){
    //       item.type = 'unstyled'
    //     }
    //   }
    // })
    // console.log(blocks)
    // console.log(entityMap);
    // const entityArray = Array.from(entityMap)
    // const entityArray = Object.entries(entityMap);
    // blocks.map((item) => {
    //   if(item.type === 'atomic'){
    //     const src = entityMap[atomicIdx].data?.src
    //      htmltext += `<img src=${src} />`;
    //     atomicIdx++;
    //   } else {
    //     htmltext += `<p>${item.text}</p>`;
    //   }
    // })
    // console.log(entityArray)
    // console.log(htmltext)
    // if(withImages) {
    //   const edit = EditorState.createWithContent(convertFromRaw(withImages))
    // }
    // const converted = draftToHtml(convertToRaw(edit))
      // for(let key in {...entityMap}) {
      //   entityMap[key].data.width = 'auto'
      //   entityMap[key].data.height = 'auto'
      // }
      const htmlcontent = draftToHtml(converted)
      inactiveStore.editor = htmlcontent
  }, [editorState])

  useEffect(() => {
    if(props.html){
      convertHtmlToDraft(props.html)
    }
    if(props.readMode === true) { 
      document.getElementsByClassName("DraftEditor-editorContainer")[0].style.height = 'auto';
      document.getElementsByClassName("DraftEditor-editorContainer")[0].style.maxWidth = '1200px';
    } else {
      document.getElementsByClassName("DraftEditor-editorContainer")[0].style.height = '300px'
    }
  }, [props.html])

  function convertHtmlToDraft(html) {
    const blocksFromHTML = ''//htmlToDraft(html);
    const state = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap)
    console.log('after', state)
    setEditorState(EditorState.createWithContent(state))
  }

  const Block_Types = [
    {
      label: <Icon name='heading1' style={{color: 'black', width: '20px', height: '20px', margin: '5px'}}/>, style: 'header-one'
    },
    {
      label: <Icon name='heading2' style={{color: 'black', width: '20px', height: '20px', margin: '5px'}}/>, style: 'header-two'
    },
    {
      label: <Icon name='heading3' style={{color: 'black', width: '20px', height: '20px', margin: '5px'}}/>, style: 'header-three'
    },
    {
      label: <Icon name='numbered-text' style={{color: 'black', width: '20px', height: '20px', margin: '5px'}}/>, style: 'ordered-list-item'
    },
    {
      label: <Icon name='bullet-text' style={{color: 'black', width: '20px', height: '20px', margin: '5px'}}/>, style: 'unordered-list-item'
    }
  ]

  var Inline_Styles = [
    {
      label: <Icon name='bold-text' style={{color: 'black', width: '20px', height: '20px', margin: '5px'}}/>, style: 'BOLD'
    },
    {
      label: <Icon name='italic-text' style={{color: 'black', width: '20px', height: '20px', margin: '5px'}}/>, style: 'ITALIC'
    },
    {
      label: <Icon name='underline-text' style={{color: 'black', width: '20px', height: '20px', margin: '5px'}}/>, style: 'UNDERLINE'
    }
  ]

  function BlockType(blockType) {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType))
  }

  function InlineStyle(inlineStyle) {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle))
  }

  const handleKeyCommand = async (e) => {
    const newState = await RichUtils.handleKeyCommand(editorState, e)
    if(newState) {
      setEditorState(newState)
      return 'handled';
    }
    if(e === 'backspace'){
      var selection = editorState.getSelection();
      if(!selection.isCollapsed() || selection.getAnchorOffset() || selection.getFocusOffset()){
        return null;
      }
      var content = editorState.getCurrentContent();
      var startKey = selection.getStartKey();
      var blockBefore = content.getBlockForKey(startKey);
      if(blockBefore && blockBefore.getType() === 'atomic') {
        const blockMap = content.getBlockMap().delete(blockBefore.getKey());
        var withoutAtomicBlock = content.merge({
          blockMap,
          selectionAfter: selection,
        });
        if(withoutAtomicBlock !== content) {
          const newContent = withoutAtomicBlock.set('entityMap', {});
          const newEditorState = EditorState.createWithContent(newContent);
          await setEditorState(newEditorState)
        }
      }
    }
    if(e === 'split-block') {
      var selection2 = editorState.getSelection();
      if(!selection.isCollapsed() || selection.getAnchorOffset() || selection.getFocusOffset()){
        return null;
      }
      var content2 = editorState.getCurrentContent();
      var startKey2 = selection2.getStartKey();
      var blockBefore2 = content2.getBlockForKey(startKey2);
      if(blockBefore2.getType() === 'atomic') {
        const selection = editorState.getSelection()
        var Key = selection.getFocusKey()
        console.log(selection)
        const nextBlock = content.getBlockAfter(Key)
        console.log(nextBlock.key)
        // var selectionState = selection.merge({'anchorKey': nextBlock, anchorOffset: })
        const newContent = Modifier.setBlockType(content, content.getSelectionBefore(), 'unstyled')
        const newEditor = EditorState.push(editorState, newContent, 'insert-fragment')
        setEditorState(newEditor)
      }
    }
    return 'not-handled';
  }

  function uploadImgViaFile (e) {
    const File = e.detail.files;
    const fileType = File[0].type;
    if(fileType === "image/jpeg" || fileType === "image/png") {
      handlePastedFiles(File)
    } else {
      alert('지원하지 않는 형식입니다.')
    }
  }

  const handlePastedFiles = (files) => {
    const img = new FileReader()
    img.readAsDataURL(files[0])
    let url = ''
    img.onload = () => {
      url = img.result
      insertImg(url)
    } 
  }

  function insertImg (url) {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "IMAGE",
      "IMMUTABLE",
      { src: url }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    if(entityKey !== null){
      const newEditorState = EditorState.set(
        editorState,
        {currentContent: contentStateWithEntity}
      );
      setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '));
    } else {
      setEditorState(editorState.getCurrentContent());
    }
  }

  const Image = (props) => {
    const emptyHtml = '';
    return <span>{emptyHtml}<img src={props.src} alt={props.alt} style={{maxWidth: '1024px', width: 'auto', height: 'auto'}}/></span>;
  };

  const ImageComponent = (props) => {
    if(props.block.getEntityAt(0) !== null){
      const entity = props.contentState.getEntity(props.block.getEntityAt(0));
      const type = entity.getType()
      const { src } = entity.getData();
      let media;
      if(type === 'IMAGE'){
        media = <Image src={src} alt={src} />;
      }
      return media;
    }
  }

  function myBlockRenderer(ContentBlock) {
    const content = editorState.getCurrentContent()
    const type = ContentBlock.getType();
    const entity = ContentBlock.getEntityAt(0);
    if(type === 'atomic' && entity !== null) {

      const entityType = content.getEntity(entity).getType();
      if(entityType === "IMAGE"){
        return {
          component: ImageComponent,
          editable: false,
        };
      } 
    }
  }

  

  return (
    <div style={{border: '1px solid #D3D4D5', width: '100%', padding: '5px 10px'}}>
      {props.readMode !== true && <div style={{borderBottom: '1px solid lightgrey', marginBottom: '10px', height: 'auto', display: 'flex', alignItems: 'center'}}>
        {Block_Types.map((item, index) => 
          <span style={{ padding: '0px 4px' }} key={index} onClick={() => BlockType(item.style)}>{item.label}</span>
        )}
        {Inline_Styles.map((item, index) => 
          <span style={{padding: '0px 4px'}} key={index} onMouseDown={() => InlineStyle(item.style)}>{item.label}</span>
        )}
        <FileUploader
          onChange={(e) => {uploadImgViaFile(e)}}
          hideInput
          >
        <span style={{padding: '0px 4px'}}><Icon name='background' style={{width: '20px', height: '20px', color: 'black', margin: '5px'}}/></span>
        </FileUploader>
      </div>}
      <Editor
        handlePastedFiles={handlePastedFiles}
        readOnly={props.readMode === true && true}
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        blockRendererFn={myBlockRenderer}
      />
    </div>
  )
}

export default TextEditor;