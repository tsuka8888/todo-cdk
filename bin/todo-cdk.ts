#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { TodoCdkStack } from '../lib/todo-cdk-stack';

const app = new cdk.App();
new TodoCdkStack(app, 'TodoCdkStack');
