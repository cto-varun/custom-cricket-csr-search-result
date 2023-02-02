import React, { useEffect, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

const { hasOwnProperty } = Object.prototype;

export default function templateComponent(props) {
    const {
        properties,
        component,
        data = [],
        store = {},
        responseData = [],
        loading = undefined,
        error = undefined,
        payload = undefined,
        templateClassName,
        workflow = [],
    } = props;

    const [externalData, updateExternalData] = useState({});

    const [updateTemplateCount, setUpdateTemplateCount] = useState(0);

    function updateTemplateData(input, shouldOverwrite = false) {
        const clonedOldObj = cloneDeep(externalData);
        let mergedObj;
        // If the input is an object, merge it with the existing object.
        if (typeof input === 'object') {
            if (shouldOverwrite) {
                mergedObj = input;
            } else {
                mergedObj = merge(clonedOldObj, input);
            }
        }
        // Otherwise increment the count by one and assign the input to that key.
        else {
            mergedObj = merge(clonedOldObj, { [updateTemplateCount]: input });
            setUpdateTemplateCount(updateTemplateCount + 1);
        }
        updateExternalData(mergedObj);
    }

    useEffect(() => {
        if (workflow.length > 0) {
            workflow.map((item) => {
                if (hasOwnProperty.call(item, 'didMountWorkflowData')) {
                    updateTemplateData(item.didMountWorkflowData);
                }
                return item;
            });
        }
    }, []);

    function resetTemplateData() {
        updateExternalData({});
        setUpdateTemplateCount(0);
    }

    useEffect(() => {
        if (component && component.id) {
            window[window.sessionStorage?.tabId][
                `${component.id}updateTemplateData`
            ] = updateTemplateData;
            window[window.sessionStorage?.tabId][
                `${component.id}resetTemplateData`
            ] = resetTemplateData;
        }

        return () => {
            if (component && component.id) {
                delete window[window.sessionStorage?.tabId][
                    `${component.id}updateTemplateData`
                ];
                delete window[window.sessionStorage?.tabId][
                    `${component.id}resetTemplateData`
                ];
            }
        };
    });

    function getContent() {
        if (externalData && externalData.type) {
            if (externalData.type === 'error') {
                return (
                    <div className="imei-search--error">
                        {externalData.message}
                    </div>
                );
            }
            if (externalData.type === 'success') {
                return (
                    <div className="imei-search--success">
                        {externalData.message}{' '}
                    </div>
                );
            }
            if (externalData.type == '') {
                {
                    return <div>{externalData.message}</div>;
                }
            }
        }
        return null;
    }

    const ui = getContent();

    return (
        <>
            <div
                className={
                    templateClassName && templateClassName
                        ? templateClassName
                        : 'template-component'
                }
            >
                {ui}
            </div>
        </>
    );
}
