import {useCallback, useContext, useState} from "react";
import {SnackbarContext} from "../../context/snackbar";
import {SNACKBAR_TYPES} from "../../helpers/global";

export default function useSnackbar() {
  const [, setTitle] = useContext(SnackbarContext).title;
  const [, setDescription] = useContext(SnackbarContext).description;
  const [, setType] = useContext(SnackbarContext).type;

  const show = useCallback((data) => {
    /**
     * data.title
     * data.description
     * data.type
     */
    if(!data?.title) throw new Error('Title is required for the snackbar message.')
    if(!SNACKBAR_TYPES.includes(data?.type)) throw new Error('The type "' + data.type + '" is not supported yet for the snackbar message.')

    setTitle(data.title);
    setDescription(data.description)
    setType(data.type);
  }, [])

  return {show};
}
