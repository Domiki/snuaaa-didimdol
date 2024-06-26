/** @jsxImportSource @emotion/react */
import React from "react";
import {css} from "@emotion/react";
import statusColorList from "./statusColorList";

export {default as FinderInput} from "./FinderInput";
export {default as UserStatusView} from "./UserStatusView";
export {default as FilterButton} from "./FilterButton";

const StatusCheckContainerCSS = css`
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 8px 16px;
    grid-template-areas: 
        "header"
        "."
        "select"
        "user"
        "."
        "list";
    grid-template-rows: auto 24px auto auto 24px 1fr;

    display: grid;
    justify-items: center;
`;
function StatusCheckContainer({children}){
    return (
        <div css={StatusCheckContainerCSS}>
            {children}
        </div>
    )
}
export {StatusCheckContainer};

const StatusCheckHeaderCSS = css`
    grid-area: header;
    width: 100%;
    padding: 0px 8px;
    display: grid;
    gap: 8px;
    &>h1.title{
        font-size: 16px;
        font-weight: 400;
        line-height: 16px;
        text-align: left;
        &>b{
            font-weight: 800;
        }
    }
    &>h2.logo{
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
        text-align: left;
        color: var(--gray);
    }
    position: relative;
    &>div.homeLink{
        position: absolute;

        top: 0px;
        right: 8px;

        & *{
            text-decoration: none;
            font-size: 12px;
            font-weight: 600;
            line-height: 12px;
            text-align: left;
    
            color: var(--blue-primary);
        }
    }
`;
function StatusCheckHeader({children}){
    return (
        <div css={StatusCheckHeaderCSS}>
            {children}
        </div>
    )
}
export {StatusCheckHeader};

const StatusCheckStudentsViewContainerCSS = css`
    grid-area: list;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: grid;
    gap: 22px;
    grid-template-rows: auto 1fr;

`;
function StatusCheckStudentsViewContainer({children}){
    return (
        <div css={StatusCheckStudentsViewContainerCSS}>
            {children}
        </div>
    )
}
export {StatusCheckStudentsViewContainer};

const StatusCheckStudentsViewHeaderCSS = css`
    width: 100%;
    display: flex;
    gap: 16px;
    justify-content: center;
    align-items: center;
    padding: 8px;
`;
function StatusCheckStudentsViewHeader({children}){
    return (
        <div css={StatusCheckStudentsViewHeaderCSS}>
            {children}
        </div>
    )
}
export {StatusCheckStudentsViewHeader};

const StatusCheckStudentsViewBodyCSS = css`
    width: 100%;
    height: 100%;
    overflow-y: auto;
    &>div{
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-auto-rows: auto;
        row-gap: 16px;
        column-gap: 8px;
    }
`;
function StatusCheckStudentsViewBody({children}){
    return (
        <div css={StatusCheckStudentsViewBodyCSS}>
            <div>
                {children}
            </div>
        </div>
    )
}
export {StatusCheckStudentsViewBody};

const StatusCheckStudentsViewItemCSS = css`
    width: 100%;
    padding: 16px 0px;
    border-radius: 8px;
    display: grid;
    justify-items: center;
    align-items: center;

    &>div{
        display: grid;
        gap: 4px;
        &>h1{
            font-size: 20px;
            font-weight: 800;
            text-align: center;
        }
        &>h2{
            font-size: 12px;
            font-weight: 500;
            text-align: center;
        }
    }
    &.selected{
        box-shadow: 0px 4px 4px 0px #00000040;
    }
`;
function StatusCheckStudentsViewItem({user, selected, onClick}){
    const colorCSS = css(statusColorList[user.status]??statusColorList["녹"]);
    
    return (
        <div css={[StatusCheckStudentsViewItemCSS, colorCSS]} className={selected?"selected":""} onClick={onClick}>
            <div>
                <h1>{user.name}</h1>
                <h2>{`${user.colNo}-${user.major}`}</h2>
            </div>
        </div>
    )
}
export {StatusCheckStudentsViewItem};

const StatusCheckDidimdolClassSelectorCSS = css`
    grid-area: select;
    display: flex;
    justify-content: center;
    align-itens: center;
    padding-bottom: 8px;
`;
function StatusCheckDidimdolClassSelector({children, onChange}){
    return (
        <div css={StatusCheckDidimdolClassSelectorCSS}>
            <select onChange={onChange}>
                {children}
            </select>
        </div>
    )
}
export {StatusCheckDidimdolClassSelector};