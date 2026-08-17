import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    * {
    margin: 0px;
    box-sizing: border-box;
    }

    body {
    margin: 0;
    }

    @media (max-width: 767px) {
      input,
      select,
      textarea {
        min-height: 48px;
        font-size: 16px !important;
      }

      button {
        min-height: 44px;
      }
    }

`

