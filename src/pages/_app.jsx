import { PermissionProvider } from "state/permissions";
import "./style/index.css";
import "semantic-ui-css/semantic.min.css";
import { ResultProvider } from "state/results";

export default function App({ Component, pageProps }) {
  return (
    <PermissionProvider>
      <ResultProvider>
        <Component {...pageProps} />
      </ResultProvider>
    </PermissionProvider>
  );
}
