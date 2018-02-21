'use strict'

let readCLI = () =>{
  let input, output, transform;
  
  for( let i = 0; i < process.argv.length; i++){
    // When a flag is found in the command-line arguements, we set the corrisponding variable to the next value in the command line. 

    if(process.argv[i] === '-i') input = process.argv[++i]
    if(process.argv[i] === '-o') output = process.argv[++i]
    if(process.argv[i] === '-t') transform = process.argv[++i]
  }
  // Err handling. Checks if there are values in each the input, output, and transform.
  if(!input || !output || !transform){
    let err = { message: 'Command line could not be read.'};
    
    (!input) ? err.input = 'No input found. Make sure to use the -i flag followed by a path to the input file.' : err.input = input;
    
    (!output) ? err.output = 'No output found. Make sure to use the -o flag followed by a path to the desired destination.' : err.output = output;

    (!transform) ? err.transform = 'No transform command found. Make sure to use the -t flag followed by an accepted transform type.' : err.transform = transform;

    return err
  }
  
  return  [input, output, transform]
}

module.exports.readCLI = readCLI