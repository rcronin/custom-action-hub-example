"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./actions/ftp/ftp");
const server_1 = require("looker-action-hub/lib/server/server");
const dotenv = require("dotenv");
dotenv.config();
server_1.default.run();
