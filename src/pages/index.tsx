import { Field, Form, Formik, useFormikContext, useField } from "formik";
import { GetServerSideProps } from "next";
import router, { useRouter } from "next/router";
import { getMakes, Make } from "@/database/getMakes";
import { getModels, Model } from "@/database/getModels";
import { getAsString } from "@/utils/getAsString";
import { useMemo, useCallback, useState, useEffect } from "react";
import useSWR from "swr";

// Material UI
import { makeStyles } from "@material-ui/styles/";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Select, { SelectProps } from "@material-ui/core/Select";

const prices = [500, 1000, 5000, 15000, 25000, 50000, 250000];

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "auto",
    maxWidth: 500,
    padding: theme.spacing(3),
  },
}));

export interface HomeProps {
  makes: Make[];
  models: Model[];
}
export interface ModelSelectProps extends SelectProps {
  name: string;
  models: Model[];
  make: string;
}

export function ModelSelect({ models, make, ...props }: ModelSelectProps) {
  const { setFieldValue } = useFormikContext();
  const [field] = useField({ name: props.name });
  const [newModels, setNewModels] = useState(models);

  const fieldHasValue = useCallback(
    (values: Model[]) => !values.map((v) => v.model).includes(field.value),
    [field]
  );

  const { data } = useSWR<Model[]>(`/api/models?make=${make}`, {
    onSuccess: (newValues) => {
      if (fieldHasValue(newValues)) setFieldValue("model", "all");
    },
  });

  useEffect(() => {
    if (data) setNewModels(data);
  }, [data]);

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="search-model">Model</InputLabel>

      <Select labelId="search-model" label="Model" {...field} {...props}>
        <MenuItem value="all">
          <em>All Models</em>
        </MenuItem>

        {newModels.map((model) => (
          <MenuItem key={model.model} value={model.model}>
            {`${model.model} (${model.count})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function Home({ makes, models }: HomeProps) {
  const classes = useStyles();
  const { query } = useRouter();

  const initialValues = useMemo(
    () => ({
      make: getAsString(query.make || "all"),
      model: getAsString(query.model || "all"),
      minPrice: getAsString(query.minPrice || "all"),
      maxPrice: getAsString(query.maxPrice || "all"),
    }),
    [query]
  );

  const onSubmitHandler = useCallback((values) => {
    router.push(
      {
        pathname: "/",
        query: { ...values, page: 1 },
      },
      undefined,
      { shallow: true }
    );
  }, []);

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmitHandler}>
      {({ values }) => (
        <Form>
          <Paper elevation={5} className={classes.paper}>
            <Grid container spacing={3}>
              {/* Makes Input */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-make">Make</InputLabel>

                  <Field name="make" as={Select} labelId="search-make" label="Make">
                    <MenuItem value="all">
                      <em>All Makes</em>
                    </MenuItem>

                    {makes.map((make) => (
                      <MenuItem
                        key={make.make}
                        value={make.make}
                      >{`${make.make} (${make.count})`}</MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>

              {/* Model Input */}
              <Grid item xs={12} sm={6}>
                <ModelSelect make={values.make} name="model" models={models} />
              </Grid>

              {/* Min Price Input */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-min-price">Min Price</InputLabel>

                  <Field name="minPrice" as={Select} labelId="search-min-price" label="Min Price">
                    <MenuItem value="all">
                      <em>No Min</em>
                    </MenuItem>

                    {prices.map((price) => (
                      <MenuItem key={price} value={price}>
                        {price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>

              {/* Max Price Input */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="search-max-price">Max Price</InputLabel>

                  <Field name="maxPrice" as={Select} labelId="search-max-price" label="Max Price">
                    <MenuItem value="all">
                      <em>No Max</em>
                    </MenuItem>

                    {prices.map((price) => (
                      <MenuItem key={price} value={price}>
                        {price}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>

              {/* Submit Btn */}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make || "");
  const [makes, models] = await Promise.all([getMakes(), getModels(make)]);
  return { props: { makes, models } };
};
