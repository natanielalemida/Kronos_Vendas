import { Modal, StyleSheet, TouchableOpacity, View, Text, TextInput, Alert, Switch } from "react-native";
import { Dispatch, SetStateAction, useState } from "react";
import useSaveSettings from "../selectHost/hooks/useSaveSettings";
import { styles } from "./styles";

type ModalSelectType = {
    isActive: boolean,
    host?: string,
    terminal?: string,
    codStore?: string,
    setHost: Dispatch<SetStateAction<string | undefined>>, 
    setCodStore: Dispatch<SetStateAction<string | undefined>>
    setTerminal :  Dispatch<SetStateAction<string | undefined>>
    closeModal: () => void
}

export default function ModalSelectLocalParametros({ isActive, host, terminal, codStore, closeModal, setHost, setCodStore, setTerminal }: ModalSelectType) {
    const [isEnabled, setIsEnabled] = useState(false);

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
    };

   const { handleSave } = useSaveSettings({
        host,
        codStore,
        terminal,
        closeModal
    })

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={false}
            onRequestClose={() => closeModal()}
        >
            <TouchableOpacity onPress={() => closeModal()} style={styles.modalBackground}>
                <View style={styles.modalContent}>
                    <View style={styles.title}>
                        <Text style={styles.modalTitle}>Configurações de parametros locais</Text>
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>parametro1:</Text>
                        <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                        />
                    </View>
                    <TouchableOpacity style={styles.buttonContainer} onPress={handleSave}>
                        <Text style={styles.buttonLabel}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

