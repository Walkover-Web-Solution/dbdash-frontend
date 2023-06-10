/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import './customAutoSuggest.css';
const CustomAutoSuggest = ({ id, suggestion, chipClass, editableDivClass, suggestionBoxClass, onEnterBtnEvent, getInputValueWithContext, setHtml, setText, defaultValue }) => {
    let suggestions = suggestion || [];
    const editableDivRef = useRef();
    const parentDivRef = useRef();
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [currentValuee, setcurrentValuee] = useState();
    const [suggestionPosition, setSuggestionPosition] = useState({ left: 0, top: 0 });
    const handleGetCaretCoordinates = () => {
        if (!parentDivRef.current && !editableDivRef.current) return;
        const parentDiv = parentDivRef.current;
        const editableDiv = editableDivRef.current;
        const selection = window.getSelection();
        const range = document.createRange();
        // Set the range to the editable div's contents
        range.selectNodeContents(editableDiv);
        // Set the range's end to the current selection
        range.setEnd(selection.anchorNode, selection.anchorOffset);
        // Calculate the caret position
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
    const getInputValueWithContent = () => {
        if (!editableDivRef.current) return;
        let htmlCode = editableDivRef.current.innerHTML;
        var temporaryElement = document.createElement('div');
        temporaryElement.innerHTML = htmlCode;
        var spanElements = temporaryElement.getElementsByTagName('span');
        for (var i = spanElements.length - 1; i >= 0; i--) {
            var span = spanElements[i];
            var dataAttribute = span.getAttribute('data-attribute') + "  ";
            var textNode = document.createTextNode(dataAttribute);
            span.parentNode.replaceChild(textNode, span);
        }
        var convertedHtmlCode = temporaryElement.innerText;
        if (setHtml) setHtml(() => htmlCode);
        if (setText) setText(convertedHtmlCode);
        if (getInputValueWithContext) {
            getInputValueWithContext(convertedHtmlCode, htmlCode);
        }
    }
    const handleKeyDown = (event) => {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelectedSuggestionIndex((prevIndex) => {
                if (prevIndex === -1) {
                    return filteredSuggestions.length - 1;
                }
                return Math.max(0, prevIndex - 1);
            });
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSelectedSuggestionIndex((prevIndex) => {
                if (prevIndex === filteredSuggestions.length - 1) {
                    return -1;
                }
                return Math.min(filteredSuggestions.length - 1, prevIndex + 1);
            });
        } else if (event.key === 'Enter') {
            event.preventDefault();
            const selectedSuggestion = filteredSuggestions[selectedSuggestionIndex];
            if (selectedSuggestion) {
                insertSuggestion(selectedSuggestion);
                setSelectedSuggestionIndex(-1);
            }
            else {
                onEnterBtnEvent && onEnterBtnEvent();
            }
        }
    };
    const handleInputChange = (e) => {
        if (!editableDivRef.current && editableDivRef.current.innerText.length === 0) {
            setFilteredSuggestions([]);
            return;
        };
        getInputValueWithContent();
        const sel = window.getSelection();
        const caretOffset = sel.anchorOffset;
        const currentNode = sel.anchorNode.textContent.substring(0, caretOffset).trim();
        var words = currentNode.trim();
        const caretPosition = handleGetCaretCoordinates();
        setSuggestionPosition(caretPosition);
        words = currentNode.split(/ |\u00A0/);
        const currentWord = words[words.length - 1];
        if (currentWord.length === 0) return
        setcurrentValuee(currentWord)
        const filtered = suggestions.filter((suggestion) =>
            suggestion?.name?.toLowerCase().startsWith(currentWord.trim().toLowerCase())
        )
        setFilteredSuggestions(filtered);
        setSelectedSuggestionIndex(-1);
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
    useEffect(() => {
        if (!editableDivRef.current) return;
        editableDivRef.current.innerHTML = defaultValue || "";
    }, [])
    return (
        <div ref={parentDivRef} className="suggestionMainContainer" style={{ position: "relative" }}>
            <div id={id ? id : ''} contentEditable={true} ref={editableDivRef} onKeyDown={handleKeyDown} onInput={(e) => { handleInputChange(e); }} className={editableDivClass || 'editable-div'} suppressContentEditableWarning={true} />
            <div className={suggestionBoxClass || 'suggestionBox'}
                style={{ position: 'absolute', left: suggestionPosition.left, top: suggestionPosition.top, zIndex: 100, opacity: filteredSuggestions.length > 0 ? 1 : 0 }}
            >
                {
                    filteredSuggestions?.map((suggestion, index) => (
                        <li key={index} style={{ background: selectedSuggestionIndex === index ? '#D3D3D3' : '', cursor: 'pointer' }} onMouseDown={() => insertSuggestion(suggestion)} onClick={() => insertSuggestion(suggestion)}>
                            {suggestion.name}
                        </li>
                    ))
                }
            </div>
        </div>
    );
};
export default CustomAutoSuggest;