import React, { useEffect, useState, useRef } from "react";
import { startSearch } from "../../redux/actions/searchActions";
import { ITunesItem } from "../../types";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  ThemeProvider,
  List,
  
} from "@material-ui/core";
import { Alert, Skeleton } from "@material-ui/lab";
import styles from "./Search.module.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { createTheme, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "100vh",
    padding: theme.spacing(2),
    maxWidth: 800,
    margin: "0 auto",
    paddingTop: theme.spacing(15),

  },

  Title: {
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      fontSize: "3.5rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "4rem",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "6.5rem",
    },
  },

  search: {
    display: "flex",
    alignItems: "center",
    margin: "25px auto",
    maxWidth: 800,
  },
 button: {
    height: "100%",
    borderRadius: "0 5px 5px 0",
    minWidth: "80px",
    padding: "8px 16px",
    fontSize: "1.4rem",
    left: "-2px",
    textTransform: "none",
 
  },

 
  alert: {
  
 
  },
  card: {
    minHeight: 360,
    padding: 0,
    marginBottom: 10,

    transition: "box-shadow 0.3s ease-in-out",
    "&:hover": {
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    },
  },
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(4),
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff3d00",
    },
    secondary: {
      main: "#fdd835",
    },
  },
});

const Search: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, noMatch } = useAppSelector((state) => state.search);
  //console.log("noMatch:", noMatch);  

  const classes = useStyles();

  const [searchTerm, setSearchTerm] = useState("");
  const [visibleItems, setVisibleItems] = useState<ITunesItem[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (searchTerm && searchTerm.length >= 3) {
      setVisibleItems([]);
      setStartIndex(0);
      setHasMore(true);
  
      dispatch(startSearch(searchTerm));
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch(); // enter to search
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // focus the input on load
    }
  }, []);

 
//limit first search load item to 10
  useEffect(() => {
    if (items.length > 0) {
      setVisibleItems(items.slice(0, 10));
      setStartIndex(10);
      setHasMore(items.length > 10);
    } else {
      setVisibleItems([]);
      setStartIndex(0);
      setHasMore(false);
    }
  }, [items]);

  //Lazy load tiles
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore) {
          setStartIndex((prevIndex) => prevIndex + 10);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    const currentRef = loaderRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, startIndex]);  

  useEffect(() => {
    setVisibleItems(items.slice(0, startIndex));
    setHasMore(startIndex < items.length);
  }, [items, startIndex]);  



  return (
    <div className={styles.Search}>
      <ThemeProvider theme={theme}>
        <Box className={classes.container}>
          <Typography  variant="h1" component="div" className={classes.Title}>
            Tune Finder
          </Typography>
          <Box className={classes.search}>
            <TextField
              label="Search for artist, album, or song"
              variant="outlined"
              fullWidth
              onKeyDown={handleKeyPress}
              value={searchTerm}
              onChange={handleChange}
              inputRef={inputRef} // focus on load
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              className={classes.button}
          
            >
              Search
            </Button>
          </Box>
          {visibleItems.length > 0 && (
            <List>
              {noMatch ? (
                <Alert className={classes.alert} severity="info">
                  No matching results found.
                </Alert>
              ) : (
                <Grid container spacing={2}>
                  {visibleItems.map((item: ITunesItem) => (
                    <Grid item xs={6} sm={4} md={4} lg={3} key={item.trackId}>
                      {loading ? (
                        <Skeleton height={180} />
                      ) : (
                        <Card style={{ cursor: "pointer" }} className={classes.card}>
                          <CardMedia
                            component="img"
                            height="260"
                            width="100"
                            image={item.artworkUrl100}
                            alt={item.trackName}
                          />
                          <CardContent>
                            <Typography
                              style={{ fontWeight: "bold", display: "block" }}
                              variant="caption"
                            >
                              {item.artistName}
                            </Typography>
                            <Typography variant="caption">{item.trackName}</Typography>
                          </CardContent>
                        </Card>
                      )}
                    </Grid>
                  ))}
                </Grid>
              )}
            </List>
          )}

          {loading && visibleItems.length > 0 && (
            <div className={classes.loaderContainer}>
              <CircularProgress />
            </div>
          )}

          {hasMore && <div ref={loaderRef} />}
        </Box>
      </ThemeProvider>
    </div>
  );
};

export default Search;

