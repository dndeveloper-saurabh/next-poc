import {useCallback, useContext} from "react";
import {showSnackbar} from "../../helpers";
import {createLog, prepareAffectedKeys} from "../../helpers/cms";
import {joinToId, sanitizeId} from "../../pages/cms/cms-forms/cms-category-form";
import {useOverlayLoader} from "../overlayLoader";
import {CmsContext} from "../../context/cms/CmsContext";
import {UserContext} from "../../context";

export default function useSubmitCMS() {
  const [loading, setLoading] = useOverlayLoader(false);
  const [editFormData, setEditFormData] = useContext(CmsContext).editFormData;
  const [,setActiveItemInColumn] = useContext(CmsContext).activeItemInColumn;
  const [user] = useContext(UserContext).user;
  const [ref] = useContext(CmsContext).activeDirRef;

  const isUniqueCategory = (allItems, isEditMode, id, name, serialOrder, options) => {
    function checkForTheOptions(c, options) {
      return options.every(({key, value}) => c[key] !== value);
    }
    return allItems.every(c => {
      if(isEditMode) {
        return (c.serial_order !== +serialOrder && c.generic_name !== name.trim() && checkForTheOptions(c, options)) || c.id === id;
      }
      return c.generic_name !== name.trim() && c.serial_order !== +serialOrder && checkForTheOptions(c, options) && c.id !== id;
    })
  }

  const handleSubmit = useCallback(async ({
    e,
    form,
    type,
    createObj,
    getMetaData,
    isEditMode,
    allItems,
    header,
    isFormValid,
    resetForm,
    onItemCRUDComplete = () => new Promise((res) => {
      res()
    })
  }) => {

    let logObj = {};
    let itemId = null;
    window.onbeforeunload = function() {
      return 'Please confirm!'
    }
    try {
      e.preventDefault();
      form.validate();
      if (!isFormValid()) return;

      setLoading(true);

      const {id, genericName, serialOrder, options = []} = getMetaData();

      if (!isUniqueCategory(allItems, isEditMode, id, genericName, serialOrder, options)) {
        setLoading(false);
        const dynamicKeyString = options.reduce((acc, cur) => {
          acc += ', ' + cur.label;
          return acc;
        }, '');
        return showSnackbar('Serial order' + dynamicKeyString + ' and Name must be unique in the group.', 'error');
      }

      const obj = await createObj(id);

      itemId = obj.id;

      const docRef = ref.doc(obj.id);

      await docRef.set(obj, {merge: isEditMode});

      await onItemCRUDComplete(obj, docRef);

      const msg = header + ' has been ' + (isEditMode ? 'updated' : 'created') + ' successfully!';
      logObj = {
        level: 'success',
        action: isEditMode ? 'UPDATE' : 'CREATE',
        status: msg,
        user,
        affectedKeys: isEditMode ? prepareAffectedKeys(editFormData, obj) : null,
        itemId: obj.id
      }
      await createLog(logObj);
      showSnackbar(msg, 'success');
      resetForm ? resetForm() : form.reset();
      setEditFormData(null);
    } catch (e) {
      console.log('e - ', e);
      showSnackbar('Something went wrong', 'error');
      logObj = {
        level: 'error',
        affectedKeys: null,
        action: isEditMode ? 'UPDATE' : 'CREATE',
        status: null,
        user,
        error: e.message,
        itemId
      };
      await createLog(logObj);
    }
    setLoading(false);
    setActiveItemInColumn({id: itemId, type})
    window.onbeforeunload = null;

  }, []);

  return {handleSubmit, loading}
}
