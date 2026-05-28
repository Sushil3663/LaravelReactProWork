import { createGlobalStyle, styled } from "styled-components";
import { COLORS } from "./colors";

export default createGlobalStyle`

*,
  *::before,
  *::after {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  ::-webkit-scrollbar {
        height: 5px;
        width: 5px;
      }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 7px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${COLORS.Primary};
    border-radius: 7px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }


 html {
    -webkit-text-size-adjust: 100%;
    text-rendering: optimizeLegibility;
    font-size: 10px;
    scroll-behavior: smooth;

  }

  body {

    overflow-x: hidden!important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
     font-family: 'Hanken Grotesk Variable', sans-serif;
    font-weight: 400;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
    background: rgb(250, 250, 250);
    
  }


  

  th.ant-table-cell {
    svg {
      path{
        fill: white;
        transition: all .3s ease;
      }
    }
  }

  th.ant-table-cell {
    .active {
      svg {
        path{
          fill: transparent;
        }
      }
    }
  }

.ant-menu-dark.ant-menu-inline .ant-menu-sub.ant-menu-inline, :where(.css-dev-only-do-not-override-ukxcn9).ant-menu-dark>.ant-menu.ant-menu-inline .ant-menu-sub.ant-menu-inline {
    background: ${COLORS.Primary};
}
.ant-menu-dark.ant-menu-submenu-popup>.ant-menu, :where(.css-dev-only-do-not-override-1qsq09y).ant-menu-dark>.ant-menu.ant-menu-submenu-popup>.ant-menu {
  background-color: ${COLORS.Primary};
}

.ant-form-item .ant-form-item-explain-error {
  color: #ff4d4f;
  width: 15rem;
}

.ant-upload-wrapper .ant-upload-list .ant-upload-list-item .ant-upload-list-item-name {
height: 1.7rem;
width: 20.5rem;
}

.ant-upload-wrapper .ant-upload-drag .ant-upload {
  padding: 35px;
}
.ant-menu-item-selected {
  background-color: ${COLORS.Secondary}
  color: white !important;
}

.ant-menu-item-selected a {
  color: white !important;
}


.custom-sidebar-menu {
  color: white !important;
}

 .export-loading {
    position: fixed;
    bottom: 0px;
    left: 0px;
    background-color: #fff;
    padding: 5px 10px;
    display: "block";
  }

  .ant-form-item .ant-form-item-label >label {
   
    font-weight: 600;
}
.ant-drawer .ant-drawer-header-title{
  flex-direction: row-reverse;
  .ant-drawer-close{
    margin:0;
    color:red;
  }
}

.ant-form-item .ant-form-item-explain-error {
  color: #ff4d4f;
  width: 25rem;
}

.ant-form-item .ant-form-item-explain-error {
    color: #ff4d4f;
    width: 35rem;
}


 .ant-dropdown-menu .ant-dropdown-menu-item{
      padding: 2px !important;
      }

.logout-button{
    height: 3rem;
    width: 100%;
    background-color: red;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

`;

export const InnerTableStyle = styled.div`
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    border: 1px solid white;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #444;
  }
`;

export const DropdownStyle = styled.div`
  cursor: pointer;
  padding: 3px 8px;
  transition: all 0.3s ease;
  .icon {
    margin-right: 10px;
  }
  &:hover {
    background-color: #f0f0f0;
  }
`;
