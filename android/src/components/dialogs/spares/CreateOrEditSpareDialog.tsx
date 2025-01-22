import { GetSparePartDto } from '../../../dto/SparePartDto';
import Dialog from '../../Dialog';
import CreateOrEditSparePartForm from '../../forms/spares/CreateOrEditSparePartForm';

type Props = {
    dialog: string | undefined,
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    part?: GetSparePartDto,
}

function CreateOrEditSpareDialog({ part, dialog,setDialog }: Props) {
    
    return (
       <Dialog fullScreen={false} visible={dialog === 'CreateOrEditSpareDialog'} handleClose={() => setDialog(undefined)}
        >
            <CreateOrEditSparePartForm part={part}  setDialog={setDialog} />
        </Dialog>
    )
}

export default CreateOrEditSpareDialog

