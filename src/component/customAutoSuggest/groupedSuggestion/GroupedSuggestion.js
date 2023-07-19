/*eslint-disable*/
import React, { useState, useEffect, useRef } from 'react'

export default function GroupedSuggestion({ id, editableDivRef, suggestion, chipClass, editableDivClass, suggestionBoxClass, onEnterBtnEvent, getInputValueWithContext, setHtml, setText, defaultValue, disable, symbolForSearching,placeholder,height }) {

    let suggestions = suggestion || [];

    const parentDivRef = useRef();

    const [filteredSuggestions, setFilteredSuggestions] = useState({});
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [currentValuee, setcurrentValuee] = useState();
    const [suggestionPosition, setSuggestionPosition] = useState({ left: 0, top: 0 });
    const [currentGroupDetails, setCurrentGroupDetails] = useState();

    useEffect(() => {
        if (!editableDivRef.current) return;
        editableDivRef.current.innerHTML = defaultValue || "";
    }, [editableDivRef])

    const functionForArrowUpPress = (event) => {
        if (Object.entries(filteredSuggestions).length !== 0) event.preventDefault();
        const keys = Object.keys(filteredSuggestions);
        const lastIndex = keys.length - 1;
        if (selectedSuggestionIndex === -1) {
            const currentKey = keys[lastIndex];
            const currentObjectArray = filteredSuggestions[currentKey];
            const currentObjIndex = lastIndex;
            setCurrentGroupDetails({ key: currentKey, index: currentObjIndex });
            setSelectedSuggestionIndex(currentObjectArray?.length - 1);
            return;
        }
        if (selectedSuggestionIndex === 0) {
            const currentObjIndex = currentGroupDetails.index - 1;
            const currentKey = keys[currentObjIndex] || keys[lastIndex];
            const currentObjectArray = filteredSuggestions[currentKey];
            setCurrentGroupDetails({ key: currentKey, index: currentObjIndex });
            setSelectedSuggestionIndex(currentObjectArray.length - 1);
        }
        else setSelectedSuggestionIndex(prevIndex => prevIndex - 1);
    };


    const functionForArrowDownPress = (event) => {
        if (Object.entries(filteredSuggestions).length !== 0) event.preventDefault();
        if (selectedSuggestionIndex === -1) {
            const firstKey = Object.keys(filteredSuggestions)[0];
            setCurrentGroupDetails({ key: firstKey, index: 0 });
            setSelectedSuggestionIndex(0);
        }
        else {
            const currentGroupSuggestionList = filteredSuggestions[currentGroupDetails?.key];
            if (currentGroupSuggestionList?.length - 1 === selectedSuggestionIndex) {
                var currentObjIndex = currentGroupDetails.index + 1
                var currentKey = Object.keys(filteredSuggestions)[currentObjIndex];
                if (!currentKey) {
                    currentKey = Object.keys(filteredSuggestions)[0];
                    currentObjIndex = 0;
                }
                setCurrentGroupDetails({ key: currentKey, index: currentObjIndex });
                setSelectedSuggestionIndex(0);
            }
            else setSelectedSuggestionIndex((prevIndex) => prevIndex + 1);
        }
    }

    const functionForEnterPress = (event) => {
        if(selectedSuggestionIndex === -1) setFilteredSuggestions([]);
        if (Object.keys(filteredSuggestions).length !== 0 && selectedSuggestionIndex !== -1) {
            event.preventDefault();
            let suggestionObject = filteredSuggestions[currentGroupDetails.key][selectedSuggestionIndex];
            if (suggestionObject) {
                insertSuggestion(suggestionObject);
                setSelectedSuggestionIndex(-1);
            }
        }
        else onEnterBtnEvent ? handleOnEnterEvent(event) : addNewline(event);

    }
    
    const handleOnEnterEvent = (event) => {
        event.preventDefault();
        onEnterBtnEvent();
    }

    const addNewline = (event) => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const innerHTML = editableDivRef.current.innerHTML;
        if (!innerHTML.endsWith('<br>') && !innerHTML.endsWith('</span>&nbsp;') && isCaretAtEnd()) {
            const newline = document.createElement('br');
            range.insertNode(newline);
            range.setStartAfter(newline);
            range.setEndAfter(newline);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        const newline = document.createElement('br');
        range.insertNode(newline);
        range.setStartAfter(newline);
        range.setEndAfter(newline);
        selection.removeAllRanges();
        selection.addRange(range);
        event.preventDefault();
    };
    function isCaretAtEnd() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) {
          return false; // No selection available
        }
        const range = selection.getRangeAt(0);
        const caretOffset = range.startOffset;
        const textContentLength = range.startContainer.textContent.length;
        return caretOffset === textContentLength;
      }
    const replaceDataAttributeWithSpanValue = (spanElements) => {
        for (var i = spanElements.length - 1; i >= 0; i--) {
            var span = spanElements[i];
            if (span.getAttribute('walkover-attribute')) {
                var dataAttribute = span.getAttribute('data-attribute') + "  ";
                var textNode = document.createTextNode(dataAttribute);
                span.parentNode.replaceChild(textNode, span);
            }
        }
    }

    const setHtmlAndTextCodeForOuput = (convertedHtmlCode, htmlCode) => {
        if (setHtml) setHtml(() => htmlCode);
        if (setText) setText(convertedHtmlCode);
        if (getInputValueWithContext) getInputValueWithContext(convertedHtmlCode, htmlCode);
    }

    const handleGetCaretCoordinates = () => {
        if (!parentDivRef.current && !editableDivRef.current) return;
        const parentDiv = parentDivRef.current;
        const editableDiv = editableDivRef.current;
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editableDiv);
        range.setEnd(selection.anchorNode, selection.anchorOffset);
        const caretRange = range.cloneRange();
        caretRange.collapse(false);
        const caretRect = caretRange.getBoundingClientRect();
        const parentRect = parentDiv.getBoundingClientRect();
        const characterHeight = caretRange.getBoundingClientRect().height;
        const caretCoordinates = {
            left: caretRect.left - parentRect.left,
            top: caretRect.top - parentRect.top + characterHeight,
        };
        return caretCoordinates;
    };

    const replaceBrtagWithSlashN = (htmlString) => {
        var regex = /<br\s*\/?>/gi;
        return htmlString.replace(regex, '\n');
    }

    const getInputValueWithContent = () => {
        if (!editableDivRef.current) return;
        let htmlCode = editableDivRef.current.innerHTML;
        var temporaryElement = document.createElement('div');
        temporaryElement.innerHTML = htmlCode;
        var spanElements = temporaryElement.getElementsByTagName('span');
        replaceDataAttributeWithSpanValue(spanElements);
        const newHtml = replaceBrtagWithSlashN(temporaryElement.innerHTML);
        temporaryElement.innerHTML = newHtml;
        var convertedHtmlCode = temporaryElement.innerText;
        setHtmlAndTextCodeForOuput(convertedHtmlCode, htmlCode);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowUp') functionForArrowUpPress(event);
        else if (event.key === 'ArrowDown') functionForArrowDownPress(event);
        else if (event.key === 'Enter') functionForEnterPress(event);
    };

    function searchKeys(result, query) {
        const searchResult = {};
        for (const obj of result) {
            if (obj.name.toLowerCase().includes(query)) {
                if (!searchResult[obj.groupName]) searchResult[obj.groupName] = [];
                searchResult[obj.groupName].push(obj);
            }
        }
        return searchResult;
    }

    const handleInputChange = (e) => {
        getInputValueWithContent();
        if (editableDivRef.current && editableDivRef.current.innerText.length === 0) return setFilteredSuggestions([]);
        const sel = window.getSelection();
        const caretOffset = sel.anchorOffset;
        const currentNode = sel.anchorNode.textContent.substring(0, caretOffset).trim();
        const caretPosition = handleGetCaretCoordinates();
        setSuggestionPosition(caretPosition);
        var words = currentNode.split(/ |\u00A0/);
        const currentWord = words[words.length - 1];
        let lastWord = currentWord.includes(symbolForSearching)
        if(symbolForSearching === " ") lastWord = true
        if (currentWord.length > 0 && lastWord) {
            let searchQuery = currentWord.split(symbolForSearching)
            searchQuery = searchQuery[searchQuery.length - 1]
            setcurrentValuee(symbolForSearching + searchQuery);
            const filtered = searchKeys(suggestions, searchQuery.trim().toLowerCase());
            setFilteredSuggestions(filtered);
            setSelectedSuggestionIndex(-1);
        } else {
            setFilteredSuggestions([]);
            setSelectedSuggestionIndex(-1);
        }
    };

    function setCursorPosition(element, offset) {
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(element, offset);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    const insertSuggestion = (replace) => {
        const sel = window.getSelection();
        const currentNode = sel.anchorNode;
        const caretOffset = sel.anchorOffset;
        if (currentNode && currentNode.nodeType === Node.TEXT_NODE) {
            const span = document.createElement('span');
            span.className = chipClass || 'chip';
            span.contentEditable = 'false';
            span.textContent = replace.name;
            span.setAttribute("walkover-attribute", replace.content);
            span.setAttribute("data-attribute", replace.content);
            var strwithrepsecttocursor = currentNode.nodeValue.substring(0, caretOffset);
            var strwithrepsecttocursor2 = currentNode.nodeValue.substring(caretOffset, currentNode.nodeValue.length);
            let index = strwithrepsecttocursor.lastIndexOf(currentValuee);
            var finalstr = currentNode.nodeValue.substring(0, index);
            const textNode = document.createTextNode(finalstr);
            currentNode.parentNode.insertBefore(textNode, currentNode);
            currentNode.parentNode.insertBefore(span, currentNode);
            if ((strwithrepsecttocursor2.substring(0, 1)?.length === 1 && !(strwithrepsecttocursor2?.substring(0, 1) === " ")) || strwithrepsecttocursor2.substring(0, 1)?.length === 0) {
                strwithrepsecttocursor2 = `\u00A0` + strwithrepsecttocursor2;
            }
            const textNode1 = document.createTextNode(strwithrepsecttocursor2);
            currentNode.parentNode.insertBefore(textNode1, currentNode);
            setCursorPosition(textNode1, 0, replace.name.length);
            currentNode.parentNode.removeChild(currentNode);
        }
        getInputValueWithContent();
        setFilteredSuggestions([]);

        setTimeout(() => {
            if (!editableDivRef.current) return;
            editableDivRef.current.focus();
        },);
    };

    const handlePaste = (event) => {
        event.preventDefault();
        let plainText = event.clipboardData.getData('text/plain');
         // replace new line with <br> tag.
        plainText = plainText.replace(/\n/g, '<br>');
        document.execCommand('insertHTML', false, plainText);
    }

    // RENDERING ELEMENTS FOR SUGGESTIONS
    const renderSuggetionListForGroup = (groupSugesstionArray, parentkey) => {
        return groupSugesstionArray.map((suggestionDetailObj, index) => {
            return (
                <div {...returnListSuggestionsProps(suggestionDetailObj, index)} style={returnStyleForSuggestionList(index, parentkey)}>
                    <span className='listSuggestions'>{suggestionDetailObj.name}</span>
                    <span className='valueContent' >{suggestionDetailObj.content}</span>
                </div>
            )
        })
    }

    const renderGroups = (key, groupSugesstionArray) => {
        return (
            <div className='groupBlock' key={key}>
                <div className='ulTag'>{key}</div>
                {renderSuggetionListForGroup(groupSugesstionArray, key)}
            </div>
        )
    }

    // PROPS FOR COMPONENTS 
    const parentDivProps = {
        ref: parentDivRef,
        className: "suggestionMainContainer",
    }

    const styleForParentDiv = {
        position: "relative"
    }

    const editableDivProps = {
        "data-text": placeholder,
        id: id ? id : '',
        contentEditable: disable === true ? false : true,
        ref: editableDivRef,
        className: editableDivClass || 'editable-div',
        suppressContentEditableWarning: true,
        onKeyDown: handleKeyDown,
        onInput: (e) => { handleInputChange(e); },
        onPaste: (e) => { handlePaste(e); },
    }

    const styleForSuggestionBox = {
        position: 'absolute',
        left: suggestionPosition.left,
        top: suggestionPosition.top,
        opacity: Object.entries(filteredSuggestions).length > 0 ? 1 : 0,
        zIndex: 100,
    }

    const returnListSuggestionsProps = (obj, index) => {
        return {
            key: index,
            className: 'listSuggestionContainer',
            onMouseDown: () => insertSuggestion(obj),
            onClick: () => insertSuggestion(obj),
        }
    }

    const returnStyleForSuggestionList = (index, parentkey) => {
        return {
            background: selectedSuggestionIndex === index && parentkey === currentGroupDetails.key ? '#D3D3D3' : '',
            cursor: 'pointer'
        }
    }

    return (
        <div {...parentDivProps} style={styleForParentDiv}>
            <div {...editableDivProps}  style={height?{minHeight:height}:{minHeight:'50px'}}  />
            <div className={suggestionBoxClass || 'suggestionBox'} style={styleForSuggestionBox}>
                {Object.entries(filteredSuggestions).map(([key, groupSugesstionArray]) => renderGroups(key, groupSugesstionArray))}
            </div>
        </div>
    );
}
