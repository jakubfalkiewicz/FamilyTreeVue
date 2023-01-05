const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

// Pole „_id” (które ma modelować roomId) dodawane jest domyślnie, dlatego pomijamy je w deklaracji
const roomSchema = new Schema({
    name: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    password: { type: String, required: true },
    joinedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [{
        author: { type: String, required: true },
        message: { type: String, required: true },
    }, ],
});

roomSchema.pre("save", function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

roomSchema.methods.comparePassword = function(plaintext, callback) {
    return callback(null, bcrypt.compareSync(plaintext, this.password));
};

module.exports = model("Room", roomSchema);