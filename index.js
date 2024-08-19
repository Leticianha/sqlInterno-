import { useEffect, useState } from 'react';
import { View, Button, StyleSheet, TextInput, Alert, FlatList } from 'react-native';
import { usarBD } from './hooks/usarBD';
import { Produto } from './components/produto';

export function Index() {

    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [produtos, setProdutos] = useState([]);

    const produtosBD = usarBD();

    async function create() {
        if (isNaN(quantidade)) {
            return Alert.alert('Quantidade', 'A quantidade precisa ser um número!');
        }
        try {
            const item = await produtosBD.create({
                nome,
                quantidade,
            });
            Alert.alert('Produto cadastrado com o ID: ' + item.idProduto);
            setId(item.idProduto);
            listar();
        } catch (error) {
            console.log(error);
        }
    };

    async function listar() {
        try {
            const captura = await produtosBD.read(pesquisa)
            setProdutos(captura)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        listar();
    }, [pesquisa]);
    
    const del = async (id) => {
        try {
            await produtosBD.del(id);
            await listar();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Nome" onChangeText={setNome} value={nome} />
            <TextInput style={styles.input} placeholder="Quantidade" onChangeText={setQuantidade} value={quantidade} />
            <Button title="Salvar" onPress={create} />
            <TextInput style={styles.input} placeholder="Pesquisar" onChangeText={setPesquisa}/>

            <FlatList
                contentContainerStyle={styles.listContent}
                data={produtos}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <Produto data={item} onDelete={() => del(item.id)} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 32,
        gap: 16,
        backgroundColor: '#F2F2F2'
    },
    input: {
        height: 54,
        borderWidth: 2,
        borderRadius: 50,
        borderColor: "#999",
        paddingHorizontal: 16,
    },
    listContent: {
        gap: 20,
    },
});