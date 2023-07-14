/*eslint-disable*/
import React, { useState, useRef, useEffect } from 'react';

export default function SimpleAutoSuggest({ id, editableDivRef, suggestion, chipClass, editableDivClass, suggestionBoxClass, onEnterBtnEvent, getInputValueWithContext, setHtml, setText, defaultValue, disable, symbolForSearching ,placeholder}) {

    let suggestions = suggestion || [];
    const parentDivRef = useRef();
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [currentValuee, setcurrentValuee] = useState();
    const [suggestionPosition, setSuggestionPosition] = useState({ left: 0, top: 0 });

    useEffect(() => {
        if (!editableDivRef?.current) return;
        editableDivRef.current.innerHTML = defaultValue || "";
    }, [editableDivRef])


    const functionForArrowUpPress = (event) => {
        if (filteredSuggestions.length !== 0) event.preventDefault();
        setSelectedSuggestionIndex((prevIndex) => {
            if (prevIndex === -1) return filteredSuggestions.length - 1;
            return Math.max(0, prevIndex - 1);
        });
    }

    const functionForArrowDownPress = (event) => {
        if (filteredSuggestions.length !== 0) event.preventDefault();
        setSelectedSuggestionIndex((prevIndex) => {
            if (prevIndex === filteredSuggestions.length - 1) return 0;
            return Math.min(filteredSuggestions.length - 1, prevIndex + 1);
        });
    }

    const functionForEnterPress = (event) => {
        if(selectedSuggestionIndex === -1) setFilteredSuggestions([]);
        const selectedSuggestion = filteredSuggestions[selectedSuggestionIndex];
        if (selectedSuggestion) {
            event.preventDefault();
            insertSuggestion(selectedSuggestion);
            setSelectedSuggestionIndex(-1);
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
            const filtered = suggestions.filter((suggestion) => suggestion?.name?.toLowerCase().startsWith(searchQuery.trim().toLowerCase()));
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
         // replace new line with  <br> tag
        plainText = plainText.replace(/\n/g, '<br>');
        document.execCommand('insertHTML', false, plainText);

    }

    // RENDERING HTML ELEMENTS FOR SUGGESTIONS LIST.
    const renderSuggestions = (suggestion, index) => {
        return <div {...returnListSuggestionsProps(suggestion, index)} style={returnStyleForSuggestionList(index)}>
            <div className='listSuggestionTag'> {suggestion.name} </div>
            <div className='listSuggestionTagContent'> {suggestion.content} </div>
        </div>
    }

    // PROPS FOR COMPONENTS.
    const parentDivProps = {
        ref: parentDivRef,
        className: "suggestionMainContainer",
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

    const returnListSuggestionsProps = (suggestion, index) => {
        return {
            key: index,
            className: 'listSuggestionContainerForSimpleAutosuggest',
            onMouseDown: () => insertSuggestion(suggestion),
            onClick: () => insertSuggestion(suggestion),
        }
    }

    // COMPONENTS STYLES.
    const styleForSuggestionBox = {
        position: 'absolute',
        left: suggestionPosition.left,
        top: suggestionPosition.top,
        opacity: Object.entries(filteredSuggestions).length > 0 ? 1 : 0,
        zIndex: 100,
    }

    const styleForParentDiv = {
        position: "relative"
    }

    const returnStyleForSuggestionList = (index) => {
        return {
            background: selectedSuggestionIndex === index ? '#D3D3D3' : '',
            cursor: 'pointer'
        }
    }

    return (
        <div {...parentDivProps} style={styleForParentDiv}>
            <div {...editableDivProps} />
            <div className={suggestionBoxClass || 'suggestionBox'} style={styleForSuggestionBox}>
                {filteredSuggestions?.map((suggestion, index) => (renderSuggestions(suggestion, index)))}
            </div>
        </div>
    );
}
