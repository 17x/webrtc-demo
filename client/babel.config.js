module.exports = {
    "presets" : [
        [
            "@babel/preset-env", {
            "targets": {
                "safari": "11.1"
            }
        }
        ]
    ],
    "plugins" : [
        "@babel/plugin-proposal-class-properties"
    ]
}