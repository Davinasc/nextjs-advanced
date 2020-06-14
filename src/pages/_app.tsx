import App from "next/app";
import Head from "next/head";
import theme from "@/styles/theme";
import axios from "axios";
import { SWRConfig } from "swr";

// Material UI
import { ThemeProvider } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";

// Custom Component
import Layout from "@/containers/layout";

export default class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) jssStyles.parentElement.removeChild(jssStyles);
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>Nextjs - Advanced</title>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>

        <ThemeProvider theme={theme}>
          <CssBaseline />

          <SWRConfig value={{ fetcher: (url: string) => axios(url).then((res) => res.data) }}>
            <Container>
              <Box marginTop={10}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </Box>
            </Container>
          </SWRConfig>
        </ThemeProvider>
      </>
    );
  }
}
