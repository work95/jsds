const fs = require('fs');

function ANN() 
{
	// Input neurons.
	this.inputLayer = [];

  // List of hidden layers.
  // Its a vector of N x N matrices.
	this.hiddenLayers = [];

  // List of weights in between layers.
	this.weightList = [];

  // Output layer neurons. Output will be passed 
  // in matrix form.
	this.outputLayer = [];

  // Topology of the network.
  this.topology = [];

  // Number of times to loop the model through the dataset.
  this.trainingIterations = 60000;

  // Initialize the Network.
  this.initialize();
}

Array.prototype.last = function () {
	return this[this.length - 1];
}

Array.prototype.first = function () {
	return this[0];
}

ANN.prototype.initializeFromFile = function (weight_file_name, trainingIterations)
{
  this.trainingIterations = trainingIterations;
  if (!this.loadWeights(weight_file_name)) {
    this.initialize();
  }
}

/* 
 * Initializes the network entities (weights, layers) 
 * with random/initial values. 
 */
ANN.prototype.initialize = function () 
{
  // Form the hidden layers and initialize them.
  for (let i = 1; i < this.topology.length - 1; i++) {
    this.hiddenLayers.push(this.matrixInitialize(1, this.topology[i]));
  }

  // Initialize the weight matrices.
  for (let i = 1; i < this.topology.length; i++) {
    let layer = [];
    for (let j = 0; j < this.topology[i - 1]; j++) {
      let sub_layer = [];
      for (k = 0; k < this.topology[i]; k++) {
        // Insert a random value.
        sub_layer.push(1 + (0.31 * (j + 0.01) * (k + 0.01)));
      }
      layer.push(sub_layer);
    }
    this.weightList.push(layer);
  }
}

/* Train model. */
ANN.prototype.trainModel = function (outputTarget)
{
  /*
   * To check if the current calculated percentage is not already displayed.
   * Since there are many training iterations, and percentages are Math.ceil() 'ed,
   * so same percentages will show up often.
   */
  let last_percent = 0;

  // Back-Propagate for output layer.
  let layerOutputError;
  let layerOutputDelta;

  // Back-Propagate for hidden layers.
  let layerHiddenError;
  let layerHiddenDelta;

  for (let i = 0; i < this.trainingIterations; i++) {

    // For percentage of training done.
    let current_percent = Math.ceil((i / this.trainingIterations) * 100);
    if (current_percent % 10 == 0 && current_percent != last_percent) {
      last_percent = current_percent;
      console.log("Training Progress: " + current_percent + "%");
    }

    // Feed-Forward for 1st hidden layer.
    this.hiddenLayers[0] = this.matrixSigmoid(
      this.matrixDot(
        this.inputLayer, 
        this.weightList.first()), 
      false);

    // Feed-Forward for remaining layers.
    for (let j = 1; j <= this.hiddenLayers.length - 1; j++) {
      this.hiddenLayers[j] = this.matrixSigmoid(this.matrixDot(
        this.hiddenLayers[j - 1], 
        this.weightList[j]), 
      false);
    }

    // Feed-Forward for output layer.
    this.outputLayer = this.matrixSigmoid(
      this.matrixDot(
        this.hiddenLayers.last(), 
        this.weightList.last()), 
      false);

    layerOutputError = this.matrixOperations(
      outputTarget, 
      this.outputLayer, '-');

    layerOutputDelta = this.matrixOperations(
      layerOutputError, 
      this.matrixSigmoid(this.outputLayer, true), 
      '*');

    layerHiddenError = [];
    layerHiddenDelta = [];

    // Back-Propagate for last hidden layers.
    layerHiddenError.push(this.matrixDot(
      layerOutputDelta, 
      this.matrixTranspose(this.weightList.last())));

    layerHiddenDelta.push(this.matrixOperations(
      layerHiddenError.last(), 
      this.matrixSigmoid(this.hiddenLayers.last(), true), 
      '*'));
    
    // Back-Propagate for remaining hidden layers.
    for (let j = this.hiddenLayers.length - 2; j >= 0; j--) {
      layerHiddenError.push(this.matrixDot(
        layerHiddenDelta.last(), 
        this.matrixTranspose(this.weightList[j + 1])));

      layerHiddenDelta.push(this.matrixOperations(
        layerHiddenError.last(), 
        this.matrixSigmoid(this.hiddenLayers[j], true), 
        '*'));
    }

    // Update weights for last weight set.
    let k = 0;
    this.weightList[this.weightList.length - 1] = this.matrixOperations(
      this.weightList.last(), 
      this.matrixDot(
        this.matrixTranspose(this.hiddenLayers.last()), 
        layerOutputDelta), 
      '+');


    // Update weights for remaining weight sets (excluding first weight set).
    for (let j = this.weightList.length - 2; j >= 1; j--) {
      this.weightList[j] = this.matrixOperations(
        this.weightList[j], 
        this.matrixDot(
          this.matrixTranspose(this.hiddenLayers[j - 1]), 
          layerHiddenDelta[k++]), 
        '+');
    }

    // Update weights for input layer --> first hidden layer.
    this.weightList[0] = this.matrixOperations(
      this.weightList.first(), 
      this.matrixDot(
        this.matrixTranspose(this.inputLayer), 
        layerHiddenDelta.last()), 
      '+');
  }

  console.log("<-- Training Complete -->");
}

ANN.prototype.testModel = function (inputs)
{
  let lh = [];
  let lo = [];

  // Form the hidden layers and initialize them.
  for (let i = 1; i < this.topology.length - 1; i++) {
    lh.push(this.matrixInitialize(1, this.topology[i]));
  }

  // Feed-Forward for 1st hidden layer.
  lh[0] = this.matrixSigmoid(
    this.matrixDot(inputs, this.weightList.first()), 
    false);

  // Feed-Forward for remaining layers.
  for (let j = 1; j <= lh.length - 1; j++) {
    lh[j] = this.matrixSigmoid(
      this.matrixDot(lh[j - 1], this.weightList[j]), 
      false);
  }

  // Feed-Forward for output layer.
  lo = this.matrixSigmoid(
    this.matrixDot(
      lh.last(), 
      this.weightList.last()), 
    false);

  return lo[0][0];
}

/* Load the previously saved weights into the matrices. */
ANN.prototype.loadWeights = function (file_name)
{
  // In case any of the weight set is not present.
  if (!fs.existsSync(file_name)) {
    return;
  }

  this.weightList = [];

  let v = fs.readFileSync(file_name).toString().split('?');
  for (let i = 0; i < v.length; i++) {
    if (v[i] != "") {
      let v1 = v[i].split('\n');

      let temp1 = [];

      for (let j = 0; j < v1.length; j++) {
        if (v1[j] != "") {
          let v2 = v1[j].split(',');
          let temp = [];
          for (k = 0; k < v2.length; k++) {
            if (v2[k] != "") {
              temp.push(parseFloat(v2[k]));
            }
          }
          temp1.push(temp);
        }
      }
      this.weightList.push(temp1);
    }
  }

  return 1;
}

/* Store the weights on disk. */
ANN.prototype.storeWeights = function (file_name)
{
  let weightStrings = [];

  for (let i = 0; i < this.weightList.length; i++) {
    let temp = "";

    let row = this.weightList[i].length;
    let col = this.weightList[i][0].length;

    // Output resulting matrix.
    for (let j = 0; j < row; j++) {
      for (let k = 0; k < col; k++) {
        temp += this.weightList[i][j][k].toString();
        temp += ",";
      }
      temp += "\n";
    }
    weightStrings.push(temp);
  }

  fs.writeFileSync(file_name, "");
  for (let i = 0; i < weightStrings.length; i++) {
    fs.appendFileSync(file_name, (weightStrings[i] + "?"));
  }
}

ANN.prototype.trainModelWithTrainingSet = function (file_name, weight_file_name)
{
  let v1 = fs.readFileSync(file_name).toString().split('\n');

  let temp = v1[0].split(':');
  let outputTarget = [];

  for (let i = 0; i < v1.length; i++) {
    if (v1[i] != "") {
      let v2 = v1[i].split(':');

      let tempInput = [];
      let tempOutput = [];

      for (let j = 0; j < v2.length; j++) {
        if (v2[j] != "") {
          if (j == v2.length - 1) {
            tempOutput.push(parseFloat(v2[j]));
          } else {
            tempInput.push(parseFloat(v2[j]));
          }
        }
      }

      this.inputLayer.push(tempInput);
      outputTarget.push(tempOutput);

      // Calculate the topology from the dataset.
      this.topology = [tempInput.length, tempInput.length + 2, tempOutput.length];
    }
  }

  this.initialize();
  this.trainModel(outputTarget, this.trainingIterations);
  this.storeWeights(weight_file_name);
}

/* Sigmoid activation function. */
ANN.prototype.sigmoid = function (input)
{
  return (1 / (1 + Math.exp(-input)));
}

/* Derivative of sigmoid function. */
ANN.prototype.sigmoidPrime = function (input)
{
  return (input * (1 - input));
}

/* 
 * Apply the sigmoid() or sigmoidPrime() function on 
 * the elements of a matrix. 
 */
ANN.prototype.matrixSigmoid = function (mat, deriv)
{
  // Initialize the resulting matrix.
  let result = this.matrixInitialize(mat.length, mat[0].length);

  // Apply sigmoid to the elements of the matrix.
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat[0].length; j++) {
      result[i][j] = deriv 
        ? this.sigmoidPrime(mat[i][j]) 
        : this.sigmoid(mat[i][j]);
    }
  }

  return result;
}

/* Transpose a matrix. */
ANN.prototype.matrixTranspose = function (matrix)
{
  // Find the column and row size.
  let row = matrix.length;
  let col = matrix[0].length;

  // Initialize the array in transpose form.
  let result = [];
  let temp = [];
  for (let i = 0; i < col; i++) {
    temp = [];
    for (let j = 0; j < row; j++) {
      temp.push(0);
    }
    result.push(temp);
  }

  // Transposing.
  for (let i = 0; i < row; i++)
   for (let j = 0; j < col; j++)
     result[j][i] = matrix[i][j];

  return result;
}

/* Perform dot product of two matrices. */
ANN.prototype.matrixDot = function (a, b)
{
  let a_row = a.length;
  let a_col = a[0].length;
  let b_col = b[0].length;

  // Initialize the array in transpose form.
  let result = this.matrixInitialize(a.length, b[0].length);

  for (let i = 0; i < a_row; i++) {
    for (let j = 0; j < b_col; j++) {
      for (let k = 0; k < a_col; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }

  return result;
}

/* Display a matrix on the terminal. */
ANN.prototype.matrixDisplay = function (mat)
{
  let row = mat.length;

  // Output resulting matrix.
  for (let i = 0; i < row; i++) {
    console.log(mat[i]);
  }
}

/* Perform arithmetic operations between two matrices. */
ANN.prototype.matrixOperations = function (a, b, op)
{
  let result = this.matrixInitialize(a.length, a[0].length);

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a[0].length; j++) {
      if (op == '+') {
        result[i][j] = a[i][j] + b[i][j];
      } else if (op == '-') {
        result[i][j] = a[i][j] - b[i][j];
      } else if (op == '*') {
        result[i][j] = a[i][j] * b[i][j];
      } else {
        result[i][j] = a[i][j] / b[i][j];
      }
    }
  }

  return result;
}

/* Initialize a matrix (with zeros). */
ANN.prototype.matrixInitialize = function (row, col)
{
  let result = [];
  let temp = [];
  for (let i = 0; i < row; i++) {
    temp = [];
    for (let j = 0; j < col; j++) {
      temp.push(0);
    }
    result.push(temp);
  }

  return result;
}

ANN.prototype.normalizeValue = function (val, max_val, min_val)
{
  return ((val - min_val) / (max_val - min_val));
}
