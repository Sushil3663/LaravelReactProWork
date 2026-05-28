import styled from "styled-components";

export const ComponentWrapper = styled.div``;

export const ProtectedRouterWrapper = styled.div`
  height: 100%;
  max-width: 100%;
  overflow-y: auto;
  .ant-table-wrapper
    .ant-table-thead
    th.ant-table-column-has-sorters:hover::before {
    background-color: white !important;
  }
  .ant-table-wrapper .ant-table-column-sorter {
    color: white !important;
  }
  .ant-table-content {
    overflow-x: auto !important;
  }
`;
