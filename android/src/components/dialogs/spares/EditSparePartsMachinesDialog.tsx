import { useContext, useState } from 'react';
import { DropDownDto } from '../../../dto/DropDownDto';
import { EditSparePartsMachinesDto, GetSparePartDto } from '../../../dto/SparePartDto';
import Dialog from '../../Dialog';
import MultiSelectComponent from '../../MultiSelectComponent';
import { useMutation, useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../../..';
import { GetAllMachinesDropdown } from '../../../services/MachineService';
import { Button, Text } from 'react-native-paper';
import { AlertContext } from '../../../contexts/AlertContext';
import { EditSparePartsMachines } from '../../../services/SparePartService';

type Props = {
    dialog: string | undefined,
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    part: GetSparePartDto,
    selectedMachines: string[]
    setSelectedMachines: React.Dispatch<React.SetStateAction<string[]>>
}

function EditSparePartsMachinesDialog({ part, dialog, selectedMachines, setSelectedMachines, setDialog }: Props) {
    const { data: machinesData } = useQuery<AxiosResponse<DropDownDto[]>, BackendError>('machines', GetAllMachinesDropdown);
    const { setAlert } = useContext(AlertContext);
    const { mutate, isLoading } = useMutation<AxiosResponse<{ message: string }>, BackendError, { body: EditSparePartsMachinesDto }>(
        EditSparePartsMachines,
        {
            onSuccess: () => {
                setAlert({ message: 'success', color: 'success' })
                setDialog(undefined)
            },
            onError: (error) => {
                error && setAlert({ message: error.response?.data?.message || 'An error occurred', color: 'error' });
            },
        }
    );


    function handleSubmit() {
        mutate({ body: { machine_ids: selectedMachines, part_id: part._id } })
    }

    return (
       <Dialog fullScreen={false} visible={dialog === 'EditSparePartsMachinesDialog'} handleClose={() => setDialog(undefined)}
        >
            <Text>{part.partno}</Text>
            <MultiSelectComponent selectedItems={selectedMachines} setSelectedItems={setSelectedMachines} items={machinesData?.data || []} />
            <Button mode="contained" loading={isLoading} onPress={() => handleSubmit()}>Save</Button>
        </Dialog>
    )
}

export default EditSparePartsMachinesDialog

