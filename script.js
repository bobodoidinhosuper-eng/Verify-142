// Sua Chave Pública Fixa (Hardcoded)
const publicKeyArmored = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: BCPG v1.58

mQENBGlUttoBCACQ5OwZp2iFGgPkPNAks1nGWlhgP42wN1Oh7NiVBCts0tWvUN9v
COIfnAM0Pfr9JqBDwibI6lkdXxXOZ6aF+agTc2YMmLoQCZWHh5x+64Q7GCUZpg98
dNFFvZJFeFH7NizeE8j0yHS/Nyxy4CNWOV0EE/JSCfxXmsk89XGUFsOnVrhLKEEG
LjbCgS32EGPkX6BoLY9Fao+20y2tH7ev30Lg+F8TBS8yTrnyVfGMr/WlPg6FLZM4
kvl08wOEn4vmdc037XamObN4q53isW618HicC4BQCovXuYztuUbaw7v0OtC3Cyel
K52aHMqOId8VeOGZsFmynFIqmGZGLmNQ0O0DABEBAAG0G2JvYm9kb2lkaW5ob3N1
cGVyQGdtYWlsLmNvbYkBHAQQAQIABgUCaVS22gAKCRBie9tYg9rZI5zLB/9pIWSr
CXpHOjy9tDpIU/qrZIrSFF42igBK5tf+DEZFUQNlskE6yx1l7VUUNg+XEfTCQFy1
TD1tAeXHHblxh1w9b7l4A0MwXt6pY2UEjz5cbzLDQ8cJuqXhTvjABNvM05ElyRXG
GQYFw3SrpBK+47ufMFrPvv3J77t15uAB+oSvkzxZaazJKPFjQNLHnzPDkhT7tE/l
6ZoG5/SNDJjCpM4ZHUtD6+T/59V3/YBekYRbLm5/B2uF2+UsKr4pnm03pfLSms7a
GDYNq5MODVnzMfQj5qfKmHViu09EjFE2ZptXLAGE8w6UjBPqafdRMxFBxB0Qyj13
y1OrGW27kqthI+ux
=kIfO
-----END PGP PUBLIC KEY BLOCK-----`;

async function verifySignature() {
    const resultDiv = document.getElementById('result');
    let signedMessageArmored = document.getElementById('signedMessage').value;

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = 'Decodificando Matriz...';
    resultDiv.className = '';

    try {
        // TRUQUE DE MESTRE: Limpeza de espaços invisíveis
        // Isso remove espaços no final de cada linha que quebram a validação
        signedMessageArmored = signedMessageArmored.split('\n').map(line => line.trimEnd()).join('\n').trim();

        // 1. Ler a chave pública que já está no código
        const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

        // 2. Ler a mensagem assinada (Inline Signed Message)
        // Isso assume que você está colando o bloco "BEGIN PGP SIGNED MESSAGE"
        const message = await openpgp.readCleartextMessage({ cleartextMessage: signedMessageArmored });

        // 3. Verificar
        const verificationResult = await openpgp.verify({
            message: message,
            verificationKeys: publicKey
        });

        // 4. Checar validade
        const { verified, keyID } = verificationResult.signatures[0];
        
        // Se a assinatura for inválida, isso aqui vai dar erro e pular pro 'catch'
        await verified; 

        // SUCESSO
        resultDiv.innerHTML = `✅ MENSAGEM AUTÊNTICA!\n\n` +
                              `Assinado por: bobodoidinhosuper@gmail.com\n` +
                              `Key ID: ${keyID.toHex().toUpperCase()}`;
        resultDiv.className = 'success';

    } catch (error) {
        // ERRO
        console.error(error);
        resultDiv.innerHTML = `❌ FALHA NA VERIFICAÇÃO.\n\n` +
                              `Motivo: O conteúdo foi alterado ou a assinatura está corrompida.\n` +
                              `Erro Técnico: ${error.message}`;
        resultDiv.className = 'error';
    }
}
