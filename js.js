// script.js

// Função para gerar um tabuleiro completo de Sudoku
function gerarTabuleiroCompleto() {
    const tabuleiro = Array(9).fill(null).map(() => Array(9).fill(0));

    // Função auxiliar para verificar se a colocação do número é válida
    function podeColocar(tabuleiro, linha, coluna, num) {
        // Verificar a linha
        for (let i = 0; i < 9; i++) {
            if (tabuleiro[linha][i] === num) return false;
        }

        // Verificar a coluna
        for (let i = 0; i < 9; i++) {
            if (tabuleiro[i][coluna] === num) return false;
        }

        // Verificar o quadrante 3x3
        const startRow = Math.floor(linha / 3) * 3;
        const startCol = Math.floor(coluna / 3) * 3;
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if (tabuleiro[i][j] === num) return false;
            }
        }

        return true;
    }

    // Função recursiva para preencher o tabuleiro com números válidos
    function preencherTabuleiro(tabuleiro) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (tabuleiro[i][j] === 0) {
                    const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    while (numeros.length > 0) {
                        const num = numeros.splice(Math.floor(Math.random() * numeros.length), 1)[0];
                        if (podeColocar(tabuleiro, i, j, num)) {
                            tabuleiro[i][j] = num;
                            if (preencherTabuleiro(tabuleiro)) return true;
                            tabuleiro[i][j] = 0;
                        }
                    }
                    return false; // Volta para o estado anterior se não encontrar uma solução
                }
            }
        }
        return true; // Tabuleiro completo
    }

    preencherTabuleiro(tabuleiro);
    return tabuleiro;
}

// Função para remover números aleatórios para criar o Sudoku jogável
function criarSudoku(tabuleiroCompleto, dificuldades = 40) {
    const tabuleiro = tabuleiroCompleto.map(linha => [...linha]); // Copiar o tabuleiro

    let tentativas = dificuldades;

    while (tentativas > 0) {
        const linha = Math.floor(Math.random() * 9);
        const coluna = Math.floor(Math.random() * 9);

        if (tabuleiro[linha][coluna] !== 0) {
            tabuleiro[linha][coluna] = 0;
            tentativas--;
        }
    }

    return tabuleiro;
}

// Função para gerar o tabuleiro e exibi-lo
function gerarTabuleiro() {
    const tabuleiroCompleto = gerarTabuleiroCompleto();
    const tabuleiro = criarSudoku(tabuleiroCompleto);

    const boardElement = document.getElementById("board");
    boardElement.innerHTML = ''; // Limpar o tabuleiro

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('input');
            cell.type = 'number';
            cell.min = '1';
            cell.max = '9';
            cell.value = tabuleiro[i][j] !== 0 ? tabuleiro[i][j] : '';
            if (tabuleiro[i][j] !== 0) {
                cell.disabled = true; // Bloquear células com números fixos
            }
            cell.dataset.row = i;
            cell.dataset.col = j;
            boardElement.appendChild(cell);
        }
    }
}

// Função para verificar se o tabuleiro está correto
function verificarTabuleiro() {
    const cells = document.querySelectorAll('#board input');
    const solution = gerarTabuleiroCompleto(); // Obter a solução completa do tabuleiro

    let correto = true;

    cells.forEach(cell => {
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        const value = parseInt(cell.value);

        if (value !== solution[row][col]) {
            correto = false;
            cell.style.backgroundColor = '#f8d7da'; // Cor de erro
        } else {
            cell.style.backgroundColor = ''; // Cor normal
        }
    });

    if (correto) {
        alert("Parabéns! Você completou o Sudoku corretamente.");
    } else {
        alert("O Sudoku não está correto. Tente novamente.");
    }
}

// Iniciar o jogo
gerarTabuleiro();
