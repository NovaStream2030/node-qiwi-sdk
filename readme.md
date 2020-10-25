**node-qiwi-sdk** - Это мощный [Node.js](https://nodejs.org) модуль, который позволяет легко взаимодействовать с QIWI API 🚀

| 📖 [Документация (Референс)](https://novastream2030.github.io/node-qiwi-sdk/) | 🤖 [Примеры](docs/examples/) |
|------------------------------------------------------|--------------------------------|

## Установка
> **[Node.js](https://nodejs.org/) 7.0.0 или выше**  

### Yarn
Рекомендуется
```shell
yarn add node-qiwi-sdk
```

### NPM
```shell
npm i node-qiwi-sdk
```

## Пример использования
```js
import { Qiwi } from 'node-qiwi-sdk';

const qiwi = new Qiwi({
    secretKey: "eyJ2ZXJzaW9uIjoicmVzdF92MyQaBLDnebLMMxL8************",
    publicKey: "Fnzr1yTebUiQaBLDnebLMMxL8nc6FF5zfmGQnypc*******"
});

const link = qiwi.createPaymentForm({
    billId: "cc961e8d-d4d6-4f02-b737-2297e51fb48e",
    amount: 42.24,
    email: "m@ya.ru",
    successUrl: "https://test.com/"
});

console.log(link);
```