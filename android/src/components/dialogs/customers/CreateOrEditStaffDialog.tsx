import React from 'react'
import Dialog from '../../../components/common/Dialog';
import CreateOrEditStaffForm from '../../forms/customers/CreateOrEditStaffForm';
import { GetUserDto } from '../../../dtos/UserDto';

type Props = {
    dialog: string | undefined,
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    staff?: GetUserDto,
    customer: string
}

function CreateOrEditStaffDialog({ staff, customer, dialog, setDialog }: Props) {
    return (
       <Dialog fullScreen={false} visible={dialog === 'CreateOrEditStaffDialog'} handleClose={() => setDialog(undefined)}
        >
            <CreateOrEditStaffForm customer={customer} staff={staff} setDialog={setDialog} />
        </Dialog>
    )
}

export default CreateOrEditStaffDialog

