const jwt = require('jsonwebtoken')

const secretKey = process.env.SECRET_KEY

exports.generateAccessToken = (user) => {
    let payload = {
        iss: 'buihieu204',
        sub: user.userId,
        aud:user.userName,
        exp: Math.floor(Date.now() / 1000 + 60*30),
        iat:Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000),
    }

    const token = jwt.sign(payload, secretKey, {algorithm: 'HS256'})
    return token
}

exports.generateRefreshToken = (user) => {
    let payload = {
        iss: 'buihieu204',
        sub: user.userId,
        aud:user.userName,
        exp: Math.floor(Date.now() / 1000 + (60*60)),
        iat:Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000),
    }
    const token = jwt.sign(payload, secretKey, {algorithm: 'HS256'})
    return token
}

exports.verifyAccessToken = (token) => {
    return jwt.verify(token, secretKey)
}

exports.verifyRefreshToken = (token) => {
    return jwt.verify(token, secretKey)
}


