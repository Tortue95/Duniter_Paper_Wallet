# Authentication on Duniter

 To be authenticated on one account on duniter, the couple Secret Key / Public Key is needed

## Introduction

DUP only deals with public keys and signatures.
A public key is always paired with a private key, which DUP will never deal with.

Today DUP manage only the algorithm ED25519
But in the future DUP can evolve to manage multiples digital signature algorithms.

So currently a public key for DUP is to be understood as an Ed25519 public key.
Its format is a Base58 string of 43 or 44 characters, such as the following:

`J4c8CARmP9vAFNGtHRuzx14zvxojyRWHW2darguVqjtX`


## Public Key Format:

### Simple Public Key

The public key for duniter can be a simple Ed25519 public key converted on base58:

`J4c8CARmP9vAFNGtHRuzx14zvxojyRWHW2darguVqjtX`

#### Public key with checksum

This function is used when a public key is typed manually on the keyboard (or issue on QRcode reader)
to avoid send a coins to the bad account. Because no control exist on the Duniter protocol

##### Exemple :
Public key:
    `J4c8CARmP9vAFNGtHRuzx14zvxojyRWHW2darguVqjtX`
Public key and checksum:
    `J4c8CARmP9vAFNGtHRuzx14zvxojyRWHW2darguVqjtX:KAv`

We have added a separator “:” to add the checksum field at the end

How is calculated the checksum:
   1. sha256(pubkey):
        `0x47c7aee49dfb9bea99949d04623281d8ad6188be8f6a698b0eb5994fa44d0a67`
   2. sha256(sha256(pubkey))
        `0x04a7ad22fbe357fbf5f58b2996fe5840fa2f977b9f6aa4c62575e68f75882672`
   3. Base58.encode(sha256(sha256(pubkey))
        `KAvdGW7rpV68WDQPVN2TCrCoyvAHqMK1nSTS8y68bmB`
   4. We take only the 3 first characters of this value to get the checksum
        `KAv`


## Key Generation:

### Key Generation with Password and Salt (Brain wallet)

By default, the key generation of the Public Key and Secret Key is created from password and salt provided by the User.

Today only this combination of this 2 algorithm are used:
    1. The seed is generated with the key derivation function “Scrypt“
    2. This seed is signed with the Algorithm “ed25519” for generate a Public key and Secret key

##### Defaut value of the different Software Client:
###### “Sakia” algorithm and parameters:


|                                        |       N   |   R |   P | Seed length |
| -------------------------------------- |----------:| ---:| ---:| -----------:|
| ** light ** (Scrypt + ed25519)         |      2048 |   8 |   1 |    32 Bytes |
| ** Secure ** (Scrypt + ed25519)        |     16384 |  32 |   2 |    32 Bytes |
| ** Hardest ** (Scrypt + ed25519)       |     65536 |  32 |   4 |    32 Bytes |
| ** Extreme ** (Scrypt + ed25519)       |    262144 |  64 |   8 |    32 Bytes |
| ** Personal value **(Scrypt + ed25519) |       Any | Any | Any |    32 Bytes |

###### “Cesium” algorithm and parameters:

|                                        |       N   |   R |   P | Seed length |
| -------------------------------------- |----------:| ---:| ---:| -----------:|
| ** Default ** (Scrypt + ed25519)       |      4096 |  16 |   1 |    32 Bytes |

With this, the user know only the salt, password and the public key
The Secret key does not need to be communicate to the user.

### Key generation with random Seed

This technique is used for other form of authentication
Ex:
    - Paper wallet,
    - Paper wallet encrypted
    - Authenticated by file on disk,
    - Authenticated by encrypted file on disk,
    - …

But instead of Key Generation with password and salt,
Here the secret key need to be stored, and transmitted to the software client  

For this we need to define a Secret key Prefixes Identifier for supporting different format of the secret key.


## Secret Key Format:

### Secret Key Prefixes Identifier:

All Secret key format have 1 Byte for prefixes at the front of the Secret key to identify the type of import used
And X bytes at the end for the checksum (if used)

|      Secret Key Format           | Identifier |                  SecretKey or Seed                |   Checksum |
|----------------------------------|------------|---------------------------------------------------|-----------:|
| **WIF  v1** (without Encryption) |       0x01 | Seed of ed25519 (32 Bytes)                        |    2 Bytes |
| **EWIF v1** (with Encryption)    |       0x01 | salt + encryptedhalf1 + encryptedhalf2 (36 Bytes) |    2 Bytes |
| **Used for future**              |       0x01 | Seed of ed25519 (32 Bytes)                        |    2 Bytes |

The output of all Secret Key Format is always converted on base58.

Note: With this identifier, we can use later a different algorithm, if the ed25519 is compromised
when DUP are able to manage multiples digital signature algorithms.


### WIF v1 - Wallet Import Format - version 1

the randomly generated Seed is used for  WIF v1 (32 bytes)

|      Secret Key Format             | Identifier |                  SecretKey or Seed                |   Checksum |
|------------------------------------|------------|---------------------------------------------------|-----------:|
| **WIF  v1** (without Encryption)   |       0x01 | Seed of ed25519 (32 Bytes)                        |    2 Bytes |

###### Ex:
For this type of Private Key Format the identifier is:
`0x01`
The Seed is 32 Bytes randomly generated:
`0xf1159316f06a2636a04d0ed4cfe9a081de4b7374e78b10cfb4fec6a2186e4085`
Checksum:
`0x0527`
All this field is concatenated (identifier + seed + checksum):
`0x01f1159316f06a2636a04d0ed4cfe9a081de4b7374e78b10cfb4fec6a2186e40850527`
And is converted on base58:
`CEmD3ebswAVSQ1YfgDzqJ9BMNHaWotvUg3QQyYspuaPKKUr`

 #####How is calculated the checksum:

**sha256(sha256(fi+seed))[0,2]**

   1. The seed is concatenated with the Private Key Format identifier (0x01)
        `0x01f1159316f06a2636a04d0ed4cfe9a081de4b7374e78b10cfb4fec6a2186e`4085
   2. sha256(fi+seed)
        `0xa0781ac0e97e2bfd5b8c2da2434ec13d2552d3aa11296c950e821fa55fb42f3a`
   3. sha256(sha256(fi+seed))
        `0x052772dedaf9d2bfb6bea53f48c221b4f3fdcd0ad4bff4d76b879c0cf94d6086`
   4. the checksum are the first 2 bytes:
        `0x0527`


### EWIF v1 – Encrypted Wallet Import Format - version 1

|      Secret Key Format           | Identifier |                  SecretKey or Seed                |   Checksum |
|----------------------------------|------------|---------------------------------------------------|-----------:|
| **EWIF v1** (with Encryption)    |       0x01 | salt + encryptedhalf1 + encryptedhalf2 (36 Bytes) |    2 Bytes |


#### Encryption steps:

   1. Compute the public key from the seed with ed25519 on base58 and take the first 4 bytes of SHA256(SHA256()) of it.  The name of this value is "salt".
   2. Derive a key from the passphrase using scrypt
        Parameters: passphrase is the passphrase itself encoded in UTF-8.
            take salt from the earlier step,
            `n=16384, r=8, p=8, length=64` (n, r, p are provisional and subject to consensus)
   3. Let's split the resulting 64 bytes in half, and call them derivedhalf1 and derivedhalf2.
   4. Do AES256 Encrypt(block = seed[0...15] xor derivedhalf1[0...15], key = derivedhalf2),
        The 16-byte result encryptedhalf1
   5. Do AES256 Encrypt(block = seed[16...31] xor derivedhalf1[16...31], key = derivedhalf2),
        The 16-byte result encryptedhalf2
   6. The encrypted private key is the Base58 concatenation of the following:
        `0x02 + salt + encryptedhalf1 + encryptedhalf2 + checksum`

 ** The checksum is calculated with **
    `sha256(sha256(0x02 + salt + encryptedhalf1 + encryptedhalf2)[0,2]`


#### Decryption steps:
   1. Collect encrypted private key and passphrase from user.
   2. Derive derivedhalf1 and derivedhalf2 by passing the passphrase and salt into scrypt function.
   3. Decrypt encryptedhalf1 and encryptedhalf2 using AES256 Decrypt and XOR,
   4. Merge them to form the seed.
   5. Convert that seed into a public key,
   6. Hash the public key, and verify that salt from the encrypted private key record matches the hash.
      If not, report that the passphrase entry was incorrect.
