import { ReactElement } from "react";
import Link from "next/link";

// Material UI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";

export interface LayoutProps {
  children: ReactElement | ReactElement[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& a": {
      color: "#fff",
      textDecoration: "none",
    },
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Layout({ children }: LayoutProps) {
  const classes = useStyles();

  return (
    <>
      <AppBar position="fixed">
        <Toolbar variant="dense" className={classes.root}>
          <Link href="/">
            <a className={classes.title}>
              <Typography variant="h6">Car Trader</Typography>
            </a>
          </Link>

          <Button>
            <Link href="/">
              <a>
                <Typography>Home</Typography>
              </a>
            </Link>
          </Button>

          <Button>
            <Link href="/faq">
              <a>
                <Typography>FAQ</Typography>
              </a>
            </Link>
          </Button>
        </Toolbar>
      </AppBar>

      {children}
    </>
  );
}
