import styled from 'styled-components';

export const SideNavWrapper = styled.div`
  position: relative;
  min-height: calc(100vh - 86px);
  max-width: 100%;
  a {
    padding-right: 50px;
  }
`;

export const ButtonWrapper = styled.div`
  position: relative;
  position: absolute;
  top: 8px;
  right: 0;
  transform: translateX(100%);
  z-index: 99;
`;
