'use strict';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import express from 'express';
const server = express();
import {render} from './app.js';

render('/', console.log)